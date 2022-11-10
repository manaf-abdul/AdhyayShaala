import Course from '../models/course.js'

export const instructorCourses = async (req, res) => {
    try {
      const courses = await Course.find({ instructor: req.user })
        .sort({ createdAt: -1 })
        .exec();
      res.json(courses);
    } catch (err) {
      console.log(err);
    }
  };