import { useContext } from "react"
import Nav from "../components/Nav"
import { authDataContext } from "../context/AuthContext"
import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"
import { RxCross1 } from "react-icons/rx";
import dp from "../assets/dp.png"
function Notification() {
  let { serverUrl, profileImage } = useContext(authDataContext)
  let [notificationData, setNotificationData] = useState([])
  const handleGetNotification = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/notification/get", { withCredentials: true })
      setNotificationData(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  function handleMessage(type) {
    if (type == "like") {
      return "liked your post"
    } else if (type == "comment") {
      return "commented on your post"
    }
    else {
      return "accepted your connection request"
    }

  }

  const handleDeleteNotification = async (id) => {
    try {
      let result = await axios.delete(serverUrl + `/api/notification/deleteone/${id}`, { withCredentials: true })
      await handleGetNotification()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClearAllNotification = async () => {
    try {
      let result = await axios.delete(serverUrl + "/api/notification", { withCredentials: true })
      await handleGetNotification()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetNotification()
  }, [])
  return (
    <div className="w-screen min-h-screen bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[40px]">
      <Nav /> 
      <div className="w-full h-[100px] bg-[white] shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600 justify-between">
        <div>

          Notifications : {notificationData.length}
        </div>
        {notificationData.length > 0 && <button className="min-w-[100px] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545] text-[20px]" onClick={handleClearAllNotification}>Clear All</button>
        }

      </div>


      {notificationData.length > 0 && (
        <div className="w-full max-w-[900px] bg-white shadow-lg rounded-lg flex flex-col divide-y divide-gray-200">
          {notificationData.map((noti, index) => (
            <div
              key={index}
              className="w-full p-[20px] flex justify-between items-center"
            >
              {/* === Left Section: Profile + Message + Post === */}
              <div className="flex flex-col gap-[10px] w-full">
                {/* Profile and Message Row */}
                <div className="flex items-center gap-[15px]">
                  <div className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer shrink-0">
                    <img
                      src={noti.relatedUser.profileImage || dp}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[18px] font-semibold text-gray-800 leading-tight">
                    {`${noti.relatedUser.firstName} ${noti.relatedUser.lastName} ${handleMessage(noti.type)}`}
                  </div>
                </div>

                {/* Related Post Section */}
                {noti.relatedPost && (
                  <div className="flex items-center gap-[10px] ml-[75px] mt-[5px]">
                    <div className="w-[80px] h-[50px] overflow-hidden rounded-md shadow-sm">
                      <img
                        src={noti.relatedPost.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-gray-600 text-[15px] leading-snug">
                      {noti.relatedPost.description}
                    </div>
                  </div>
                )}
              </div>

              {/* === Right Section: Delete Icon === */}
              <div
                className="flex justify-center items-center cursor-pointer ml-[15px]"
                onClick={() => handleDeleteNotification(noti._id)}
              >
                <RxCross1 className="w-[25px] h-[25px] text-gray-700 hover:text-red-600 transition" />
              </div>
            </div>
          ))}
        </div>
      )}



    </div>
  )
}

export default Notification