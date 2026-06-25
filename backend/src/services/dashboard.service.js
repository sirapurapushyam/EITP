import { User } from "../models/user.model.js";
import { Placement } from "../models/placement.model.js";
import { Job } from "../models/job.model.js";
import { Event } from "../models/event.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
import { EventRegistration } from "../models/eventRegistration.model.js";
import { IncubationIdea } from "../models/incubationIdea.model.js";
import { ROLES } from "../constants/roles.js";

const studentRoles = [
  ROLES.STUDENT,
  ROLES.STUDENT_INTERN
];

function profileCompletion(user) {
  let score = 0;

  if (user.profileImage?.url) score += 20;
  if (user.resume?.url) score += 20;
  if (user.linkedinProfile) score += 20;
  if (user.githubProfile) score += 20;
  if (user.skills?.length) score += 20;

  return score;
}

export const getDeanOverview = async () => {

  const [
    totalStudents,
    totalInterns,
    totalPlacements,
    totalJobs,
    totalEvents,
    totalIdeas
  ] = await Promise.all([
    User.countDocuments({
      role: ROLES.STUDENT
    }),

    User.countDocuments({
      role: ROLES.STUDENT_INTERN
    }),

    Placement.countDocuments(),

    Job.countDocuments(),

    Event.countDocuments(),

    IncubationIdea.countDocuments()
  ]);

  const placementRate =
    totalStudents + totalInterns === 0
      ? 0
      : (
          totalPlacements /
          (totalStudents + totalInterns) *
          100
        ).toFixed(1);

          const campusStats = await User.aggregate([
    {
      $group: {
        _id: "$campus",

        students: {
          $sum: {
            $cond: [
              {
                $eq: [
                  "$role",
                  ROLES.STUDENT
                ]
              },
              1,
              0
            ]
          }
        },

        interns: {
          $sum: {
            $cond: [
              {
                $eq: [
                  "$role",
                  ROLES.STUDENT_INTERN
                ]
              },
              1,
              0
            ]
          }
        },

        placed: {
          $sum: {
            $cond: [
              "$placed",
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  const placementTrend =
await Placement.aggregate([
  {
    $group: {
      _id: {
        month: {
          $month: "$createdAt"
        }
      },

      count: {
        $sum: 1
      }
    }
  }
]);

const pendingIdeas =
await IncubationIdea.find({
  coordinatorReviewedBy: {
    $ne: null
  },
  deanReviewedBy: null
})
.populate(
  "submittedBy",
  "name campus"
)
.limit(10);


const recentPlacements =
await Placement.find()
.populate(
  "student",
  "name branch campus"
)
.sort({
  createdAt:-1
})
.limit(10);


return {

summary:{
totalStudents,
totalInterns,
totalPlacements,
placementRate,
totalJobs,
totalEvents,
totalIdeas
},

campusStats,

placementTrend,

pendingIdeas,

recentPlacements

};
};


export const getCoordinatorOverview = async(user)=>{

const campus=user.campus;

const [
students,
interns,
placements,
jobs,
events
]=await Promise.all([

User.countDocuments({
campus,
role:ROLES.STUDENT
}),

User.countDocuments({
campus,
role:ROLES.STUDENT_INTERN
}),

Placement.countDocuments({
campus
}),

Job.countDocuments({
createdCampus:campus
}),

Event.countDocuments({
createdCampus:campus
})

]);


const branchDistribution =
await User.aggregate([
{
$match:{
campus,
role:{
$in:studentRoles
}
}
},
{
$group:{
_id:"$branch",
count:{
$sum:1
}
}
}
]);

const yearDistribution =
await User.aggregate([
{
$match:{
campus,
role:{
$in:studentRoles
}
}
},
{
$group:{
_id:"$yearOfStudy",
count:{
$sum:1
}
}
}
]);

const pendingIdeas =
await IncubationIdea.find({
campus,
coordinatorReviewedBy:null
})
.populate(
"submittedBy",
"name branch"
)
.limit(10);

const upcomingEvents =
await Event.find({
createdCampus:campus,
eventDate:{
$gte:new Date()
}
})
.sort({
eventDate:1
})
.limit(5);

const activeJobs =
await Job.find({
createdCampus:campus,
deadline:{
$gte:new Date()
}
})
.limit(5);

const recentPlacements =
await Placement.find({
campus
})
.populate(
"student",
"name branch"
)
.sort({
createdAt:-1
})
.limit(10);
return{

summary:{
students,
interns,
placements,
jobs,
events
},

branchDistribution,

yearDistribution,

pendingIdeas,

upcomingEvents,

activeJobs,

recentPlacements

};
};

export const getStudentOverview = async(user)=>{
    const [
appliedJobs,
registeredEvents,
submittedIdeas
]=await Promise.all([

JobApplication.countDocuments({
student:user._id
}),

EventRegistration.countDocuments({
student:user._id
}),

IncubationIdea.countDocuments({
submittedBy:user._id
})

]);

const placement =
await Placement.findOne({
student:user._id
});

const myIdeas =
await IncubationIdea.find({
submittedBy:user._id
})
.sort({
createdAt:-1
});

const upcomingJobs =
await Job.find({
deadline:{
$gte:new Date()
}
})
.limit(5);

const upcomingEvents =
await Event.find({
eventDate:{
$gte:new Date()
}
})
.limit(5);

const recentApplications =
await JobApplication.find({
student:user._id
})
.populate("job")
.sort({
createdAt:-1
})
.limit(5);

return{

summary:{
appliedJobs,
registeredEvents,
submittedIdeas,
profileCompletion:
profileCompletion(user)
},

placement,

myIdeas,

upcomingJobs,

upcomingEvents,

recentApplications

};
};


export const getInternOverview = async(user)=>{

const dashboard =
await getStudentOverview(user);

const attendanceMarked =
await Promise.all([

JobApplication.countDocuments({
markedBy:user._id
}),

EventRegistration.countDocuments({
markedBy:user._id
})

]);
const recentAttendance =
await EventRegistration.find({
markedBy:user._id
})
.populate(
"student",
"name"
)
.populate(
"event",
"title"
)
.limit(10);

return{

...dashboard,

attendance:{
jobAttendance:
attendanceMarked[0],

eventAttendance:
attendanceMarked[1]
},

recentAttendance

};
return{

...dashboard,

attendance:{
jobAttendance:
attendanceMarked[0],

eventAttendance:
attendanceMarked[1]
},

recentAttendance

};
};
