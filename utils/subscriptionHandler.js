import sendEmail from "./sendEmail.js";
import User from "../models/user.js";
import Subscription from "../models/subscription.js";

// this is dangerous
export default async (targetId) => {
  try {
    const user = await User.findById(targetId)
    const subscribers = await Subscription.aggregate([
      {
        $match: { targetId }, 
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriberId",
          foreignField: "_id",
          as: "subscriber",
        },
      },
      {
        $unwind: "$subscriber",
      },
      {
        $project: {
          _id: 0,
          email: "$subscriber.email",
        },
      },
    ]);
    const subscribersEmail = subscribers.map(s => s.email)
    
    const batchEmailSend = subscribersEmail.map(async email => {
      const subject = `${user.profile.name} posted a new article!`
      const text = 'blablabla'
      setTimeout(async () => {
        await sendEmail(email, subject, text);
      }, 1000);
    });
    
    await Promise.all(batchEmailSend)
  } catch (err) {
    throw err;
    // return res.status(500).send({ message: 'Internal server error' })
  }
};
