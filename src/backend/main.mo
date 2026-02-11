import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Nat8 "mo:core/Nat8";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // User profile type
  public type UserProfile = {
    name : Text;
  };

  // Rewards specific types
  type TaskStatus = { #pending; #approved; #rejected };
  type RewardsTask = { id : Nat; title : Text; description : Text; points : Nat; url : Text };
  type TaskSubmission = { taskId : Nat; status : TaskStatus; timestamp : Nat8 };
  type WithdrawalStatus = { #pending; #approved; #rejected };
  type WithdrawalRequest = { id : Nat; amount : Nat; status : WithdrawalStatus; timestamp : Nat8 };

  module RewardsTask {
    public func compare(task1 : RewardsTask, task2 : RewardsTask) : Order.Order {
      Nat.compare(task1.id, task2.id);
    };

    public func compareByTitle(task1 : RewardsTask, task2 : RewardsTask) : Order.Order {
      switch (Text.compare(task1.title, task2.title)) {
        case (#equal) { Nat.compare(task1.id, task2.id) };
	      case (order) { order };
      };
    };
  };

  // Include authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let totalRewardsTasks = Map.empty<Nat, RewardsTask>();
  let pointsBalance = Map.empty<Principal, Nat>();
  let taskSubmissions = Map.empty<Principal, [TaskSubmission]>();
  let withdrawalRequests = Map.empty<Principal, [WithdrawalRequest]>();

  // Tasks management
  var nextTaskId = 1;
  var nextWithdrawalId = 1;

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Rewards manipulation public functions
  public shared ({ caller }) func createTask(title : Text, description : Text, points : Nat, url : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create tasks");
    };

    let newRewardsTask : RewardsTask = {
      id = nextTaskId;
      title;
      description;
      points;
      url;
    };

    totalRewardsTasks.add(nextTaskId, newRewardsTask);
    nextTaskId += 1;
  };

  public query ({ caller }) func getAllTasks() : async [RewardsTask] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    totalRewardsTasks.values().toArray().sort();
  };

  public query ({ caller }) func getAllTasksByTitle() : async [RewardsTask] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    totalRewardsTasks.values().toArray().sort(RewardsTask.compareByTitle);
  };

  // Points management
  public query ({ caller }) func getPointsBalance() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view points balance");
    };
    switch (pointsBalance.get(caller)) {
      case (?balance) { balance };
      case (null) { 0 };
    };
  };

  // Task submissions logic
  public shared ({ caller }) func submitTask(taskId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit tasks");
    };

    let submission : TaskSubmission = {
      taskId;
      status = #pending;
      timestamp = Nat8.fromNat(0);
    };

    let existingSubmissions = switch (taskSubmissions.get(caller)) {
      case (?subs) { subs };
      case (null) { let empty : [TaskSubmission] = []; empty };
    };

    let newSubmissions = Array.tabulate(
      existingSubmissions.size() + 1,
      func(i) {
        if (i < existingSubmissions.size()) { existingSubmissions[i] } else {
          submission;
        };
      },
    );
    taskSubmissions.add(caller, newSubmissions);
  };

  public query ({ caller }) func getTaskSubmissions() : async [TaskSubmission] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view task submissions");
    };
    switch (taskSubmissions.get(caller)) {
      case (?subs) { subs };
      case (null) { let empty : [TaskSubmission] = []; empty };
    };
  };

  // Admin task verification
  public shared ({ caller }) func verifyTaskSubmission(submitter : Principal, taskId : Nat, approved : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can verify task submissions");
    };

    let userSubmissions = switch (taskSubmissions.get(submitter)) {
      case (?subs) { subs };
      case (null) { Runtime.trap("No submissions found for user") };
    };

    let updatedSubmissions = userSubmissions.map(func(sub) { if (sub.taskId == taskId) { { sub with status = if approved { #approved } else { #rejected } } } else { sub } });

    taskSubmissions.add(submitter, updatedSubmissions);

    // Update points if rewards task was approved
    if (approved) {
      let currentPoints = switch (pointsBalance.get(submitter)) {
        case (?balance) { balance };
        case (null) { 0 };
      };
      switch (totalRewardsTasks.get(taskId)) {
        case (?task) { pointsBalance.add(submitter, currentPoints + task.points) };
        case (null) { () };
      };
    };
  };

  // Withdrawal request management
  public shared ({ caller }) func createWithdrawalRequest(amount : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create withdrawal requests");
    };

    let currentBalance = switch (pointsBalance.get(caller)) {
      case (?balance) { balance };
      case (null) { 0 };
    };

    if (amount > currentBalance) {
      Runtime.trap("Insufficient balance for withdrawal");
    };

    let request : WithdrawalRequest = {
      id = nextWithdrawalId;
      amount;
      status = #pending;
      timestamp = Nat8.fromNat(0);
    };

    let existingRequests = switch (withdrawalRequests.get(caller)) {
      case (?reqs) { reqs };
      case (null) { let empty : [WithdrawalRequest] = []; empty };
    };

    let newRequests = Array.tabulate(
      existingRequests.size() + 1,
      func(i) {
        if (i < existingRequests.size()) { existingRequests[i] } else {
          request;
        };
      },
    );
    withdrawalRequests.add(caller, newRequests);
    nextWithdrawalId += 1;
  };

  public query ({ caller }) func getWithdrawalRequests() : async [WithdrawalRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view withdrawal requests");
    };
    switch (withdrawalRequests.get(caller)) {
      case (?reqs) { reqs };
      case (null) { let empty : [WithdrawalRequest] = []; empty };
    };
  };

  public shared ({ caller }) func reviewWithdrawalRequest(user : Principal, requestId : Nat, approved : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can review withdrawal requests");
    };

    let userRequests = switch (withdrawalRequests.get(user)) {
      case (?reqs) { reqs };
      case (null) { Runtime.trap("No withdrawal requests found for user") };
    };

    var requestFound = false;
    var requestAmount = 0;

    let updatedRequests = userRequests.map(
      func(req) {
        if (req.id == requestId) {
          requestFound := true;
          requestAmount := req.amount;
          { req with status = if approved { #approved } else { #rejected } };
        } else {
          req;
        };
      }
    );

    if (not requestFound) {
      Runtime.trap("Withdrawal request not found");
    };

    withdrawalRequests.add(user, updatedRequests);

    // Deduct points if approved
    if (approved) {
      let currentBalance = switch (pointsBalance.get(user)) {
        case (?balance) { balance };
        case (null) { 0 };
      };

      if (requestAmount > currentBalance) {
        Runtime.trap("Insufficient balance for withdrawal approval");
      };

      pointsBalance.add(user, currentBalance - requestAmount);
    };
  };
};
