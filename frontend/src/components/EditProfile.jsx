import { useContext, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from "../context/UserContext";
import { FiPlus } from "react-icons/fi"
import { FiCamera } from "react-icons/fi"
import dp from "../assets/dp.png"
import { useRef } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
function EditProfile({ isOwnProfile }) {
  let { edit, setEdit, userData, setUserData, handleGetProfile } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext)
  let [firstName, setFirstName] = useState(userData.firstName || "")
  let [lastName, setLastName] = useState(userData.lastName || "")
  let [userName, setUserName] = useState(userData.userName || "")
  let [headline, setHeadline] = useState(userData.headline || "")
  let [location, setLocation] = useState(userData.location || "")
  let [gender, setGender] = useState(userData.gender || "")
  let [skills, setSkills] = useState(userData.skills || [])
  let [newSkills, setNewSkills] = useState("")

  let [education, setEducation] = useState(userData.education || [])
  let [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: "",
  })

  let [experience, setExperience] = useState(userData.experience || [])
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  },)



  let [frontendProfileImage, setFrontendProfileImage] = useState(userData.profileImage || dp)
  let [backendProfileImage, setBackendProfileImage] = useState(null)


  let [frontendCoverImage, setFrontendCoverImage] = useState(userData.coverImage || null)
  let [backendCoverImage, setBackendCoverImage] = useState(null)

  let [saving, setSaving] = useState(false)

  const profileImage = useRef()
  const coverImage = useRef()

  function addSkill() {
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills])
    }
    setNewSkills("")
  }


  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill))
    }
  }


  function addEducation() {
    if (newEducation.college && newEducation.degree && newEducation.fieldOfStudy) {
      setEducation([...education, newEducation])
    }
    setNewEducation({
      college: "",
      degree: "",
      fieldOfStudy: "",
    })
  }


  function removeEducation(edu) {
    if (education.includes(edu)) {
      setEducation(education.filter((e) => e !== edu))
    }
  }


  function addExperience() {
    if (newExperience.title && newExperience.company && newExperience.description) {
      setExperience([...experience, newExperience])
    }
    setNewExperience({
      title: "",
      company: "",
      description: "",
    })
  }

  function removeExperience(exp) {
    if (experience.includes(exp)) {
      setExperience(experience.filter((e) => e !== exp))
    }
  }


  function handleProfileImage(e) {
    let file = e.target.files[0]
    setBackendProfileImage(file)
    setFrontendProfileImage(URL.createObjectURL(file))

  }

  function handleCoverImage(e) {
    let file = e.target.files[0]
    setBackendCoverImage(file)
    setFrontendCoverImage(URL.createObjectURL(file))

  }


  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      let formdata = new FormData()
      formdata.append("firstName", firstName)
      formdata.append("lastName", lastName)
      formdata.append("userName", userName)
      formdata.append("headline", headline)
      formdata.append("location", location)
      formdata.append("skills", JSON.stringify(skills))
      formdata.append("education", JSON.stringify(education))
      formdata.append("experience", JSON.stringify(experience))
      if (backendProfileImage) {
        formdata.append("profileImage", backendProfileImage)
      }
      if (backendCoverImage) {
        formdata.append("coverImage", backendCoverImage)
      }

      let result = await axios.put(serverUrl + "/api/user/updateprofile", formdata, { withCredentials: true })
      setUserData(result.data)
      setSaving(false)
      setEdit(false)
    } catch (error) {
      console.log(error);
      setSaving(false)

    }
  }


  return (

    <div className="w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center">

      <input type="file" accept="image/*" hidden ref={profileImage} onChange={handleProfileImage} disabled={!isOwnProfile} />
      <input type="file" accept="image/*" hidden ref={coverImage} onChange={handleCoverImage} disabled={!isOwnProfile} />


      <div className="w-full h-full bg-black opacity-[0.5] absolute top-0 left-0"></div>
      <div className="w-[90%] max-w-[500px] h-[600px] bg-white relative z-[200] shadow-lg rounded-lg p-[10px] overflow-auto">
        <div className="absolute top-[20px] right-[20px] cursor-pointer" onClick={() => setEdit(false)}><RxCross1 className="w-[25px] h-[25px] text-gray-800 font-bold" /></div>


        {/* Cover Image */}
        <div
          className={`w-full h-[150px] bg-gray-500 rounded-lg mt-[40px] overflow-hidden ${isOwnProfile ? "cursor-pointer" : ""}`}
          onClick={() => { if (isOwnProfile) coverImage.current.click() }}
        >
          <img src={frontendCoverImage} alt="" className="w-full h-full object-cover" />
          {isOwnProfile && (
            <FiCamera className="absolute right-[20px] top-[60px] w-[25px] h-[25px] text-white cursor-pointer" />
          )}
        </div>

        {/* Profile Image */}
        <div
          className={`w-[80px] h-[80px] rounded-full overflow-hidden absolute top-[150px] ml-[20px] ${isOwnProfile ? "cursor-pointer" : ""}`}
          onClick={() => { if (isOwnProfile) profileImage.current.click() }}
        >
          <img src={frontendProfileImage} alt="" className="w-full h-full object-cover" />
          {isOwnProfile && (
            <FiCamera className="absolute right-[0px] bottom-[0px] w-[20px] h-[20px] text-white cursor-pointer" />
          )}
        </div>


        {isOwnProfile && (
          <div
            className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[200px] left-[90px] rounded-full flex justify-center items-center cursor-pointer"
            onClick={() => setEdit(true)}
          >
            <FiPlus className="text-white" />
          </div>
        )}
 


        <div className="w-full flex flex-col items-center justify-center gap-[20px] mt-[50px]">
          <input type="text" placeholder="firstName" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="lastName" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input type="text" placeholder="userName" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <input type="text" placeholder="headline" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          <input type="text" placeholder="location" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={location} onChange={(e) => setLocation(e.target.value)} />
          <input type="text" placeholder="gender (male/female/other)" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg" value={gender} onChange={(e) => setGender(e.target.value)} />
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h1 className="text-[19px] font-semibold">Skills</h1>
            {skills && <div className="flex flex-col gap-[10px]">
              {skills.map((skill, index) => (
                <div key={index} className="w-full h-[40px] border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center"><span>{skill}</span><RxCross1 className="w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer" onClick={() => removeSkill(skill)} /></div>
              ))}
            </div>}

            <div className="flex flex-col gap-[10px] items-start">
              <input type="text" placeholder="Add new skill..." className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg" value={newSkills} onChange={(e) => setNewSkills(e.target.value)} />
              <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]" onClick={addSkill}>Add</button>
            </div>
          </div>

          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h1 className="text-[19px] font-semibold">Education</h1>
            {education && <div className="flex flex-col gap-[10px]">
              {education.map((edu, index) => (
                <div key={index} className="w-full border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center"><div>
                  <div>College: {edu.college}</div>
                  <div>Degree: {edu.degree}</div>
                  <div>Field Of Study: {edu.fieldOfStudy}</div>
                </div><RxCross1 className="w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer" onClick={() => removeEducation(edu)} /></div>
              ))}
            </div>}

            <div className="flex flex-col gap-[10px] items-start">
              <input type="text" placeholder="College" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg" value={newEducation.college} onChange={(e) => setNewEducation({ ...newEducation, college: e.target.value })} />
              <input type="text" placeholder="Degree" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} />
              <input type="text" placeholder="Field Of Study" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg" value={newEducation.fieldOfStudy} onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })} />
              <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]" onClick={addEducation}>Add</button>
            </div>
          </div>


          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
            <h1 className="text-[19px] font-semibold">Experience</h1>
            {experience && <div className="flex flex-col gap-[10px]">
              {experience.map((exp, index) => (
                <div key={index} className="w-full border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center"><div>
                  <div>Title: {exp.title}</div>
                  <div>Company: {exp.company}</div>
                  <div>Description: {exp.description}</div>
                </div><RxCross1 className="w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer" onClick={() => removeExperience(exp)} /></div>
              ))}
            </div>}

            <div className="flex flex-col gap-[10px] items-start">
              <input type="text" placeholder="Title" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg" value={newExperience.title} onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} />
              <input type="text" placeholder="Company" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} />
              <input type="text" placeholder="Experience" className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg" value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} />
              <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]" onClick={addExperience}>Add</button>
            </div>
          </div>

          <button className="w-[100%] h-[50px] rounded-full bg-[#2a9bd8] mt-[40px] text-white" disabled={saving} onClick={() => handleSaveProfile()}>{saving ? "Saving..." : "Save Profile"}</button>
        </div>


      </div>


    </div>
  )
}

export default EditProfile 