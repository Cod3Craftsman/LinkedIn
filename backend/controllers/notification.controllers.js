import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    let notification = await Notification.find({
      receiver: req.userId,
    })
      .populate("relatedUser", "firstName lastName profileImage")
      .populate("relatedPost", "image description");
    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500).json({ message: `getNotification error ${error}` });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    let { id } = req.params;
    let notification = await Notification.findByIdAndDelete({
      _id: id,
      receiver: req.userId,
    });
    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `deleteNotification error ${error}` });
  }
};

export const clearAllNotification = async (req, res) => {
  try {
    await Notification.deleteMany({
      receiver: req.userId,
    });
    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `clearAllNotification error ${error}` });
  }
};
