"use client";
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CiEdit } from "react-icons/ci";
import { FcOldTimeCamera } from "react-icons/fc";
import { storage } from "../config";
import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytes } from "firebase/storage";
import Load from "./Load";

const Profile = ({ currentUser }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [editModeName, setEditModeName] = useState(false);
  const [editModeMName, setEditModeMName] = useState(false);
  const [editModeLName, setEditModeLName] = useState(false);
  const [editModeGender, setEditModeGender] = useState(false);
  const [editModeBirthdate, setEditModeBirthdate] = useState(false);
  const [editModeEmail, setEditModeEmail] = useState(false);
  const [editModeAddress, setEditModeAddress] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [editUser, setEditUser] = useState({
    name: "",
    mname: "",
    lname: "",
    gender: "",
    Birthdate: "",
    email: "",
    PhoneNum: "",
    Address: "",
    image: "",
  });

  const handleEditName = (field) => {
    setEditModeName(true);
    setEditField(field);
    setEditValue(editUser[field]);
    setEditModeMName(false);
    setEditModeLName(false);
    setEditModeGender(false);
    setEditModeBirthdate(false);
    setEditModeGender(false);
    setEditModeAddress(false);
  };

  const handleEditMname = (field) => {
    setEditModeMName(true);
    setEditField(field);
    setEditValue(editUser[field]);
    setEditModeName(false);
    setEditModeLName(false);
    setEditModeGender(false);
    setEditModeBirthdate(false);
    setEditModeEmail(false);
    setEditModeAddress(false);
  };

  const handleEditLname = (field) => {
    setEditModeLName(true);
    setEditField(field);
    setEditValue(editUser[field]);
    setEditModeName(false);
    setEditModeMName(false);
    setEditModeGender(false);
    setEditModeBirthdate(false);
    setEditModeEmail(false);
    setEditModeAddress(false);
  };

  const handleEditGender = (field) => {
    setEditModeGender(true);
    setEditField(field);
    setEditValue(editUser[field]);
    setEditModeName(false);
    setEditModeMName(false);
    setEditModeLName(false);
    setEditModeBirthdate(false);
    setEditModeEmail(false);
    setEditModeAddress(false);
  };

  const handleEditBirthdate = (field) => {
    setEditModeBirthdate(true);
    setEditField(field);
    setEditValue(editUser[field]);
    setEditModeGender(false);
    setEditModeName(false);
    setEditModeMName(false);
    setEditModeLName(false);
    setEditModeEmail(false);
    setEditModeAddress(false);
  };

  const handleEditEmail = (field) => {
    setEditModeEmail(true);
    setEditField(field);
    setEditValue(editUser[field]);
    setEditModeGender(false);
    setEditModeName(false);
    setEditModeMName(false);
    setEditModeLName(false);
    setEditModeBirthdate(false);
    setEditModeAddress(false);
  };

  const handleEditAddress = (field) => {
    setEditModeAddress(true);
    setEditField(field);
    setEditValue(editUser[field]);
    setEditModeGender(false);
    setEditModeName(false);
    setEditModeMName(false);
    setEditModeLName(false);
    setEditModeBirthdate(false);
    setEditModeEmail(false);
  };

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleClose = () => {
    setEditModeName(false);
    setEditModeMName(false);
    setEditModeLName(false);
    setEditModeGender(false);
    setEditModeBirthdate(false);
    setEditModeEmail(false);
    setEditModeAddress(false);
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.post("/api/update", {
        id: currentUser.id,
        field: editField,
        value: editValue,
      });
      setEditModeName(false);
      setEditModeMName(false);
      setEditModeLName(false);
      setEditModeGender(false);
      setEditModeBirthdate(false);
      setEditModeEmail(false);
      setEditModeAddress(false);
      await fetchType();
    } catch (error) {
      console.error("Error updating user profile:", error);
      // Handle error
    }
    // Then, exit edit mode
    setEditModeName(false);
  };

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  const fetchType = async () => {
    const session = await getSession();

    if (session) {
      const user1 = session.user;
      try {
        const response = await fetch(`/api/currentuser/${currentUser.id}`);
        const Data = await response.json();
        setUser(Data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    } else {
      router.push(`/`);
    }
  };

  useEffect(() => {
    fetchType();
    const toggleUpload = async () => {
      try {
        const fileRef = ref(
          storage,
          `images/${currentUser.id}/${selectedImage?.name}`
        );
        const snapshot = await uploadBytes(fileRef, selectedImage);
        const downloadURL = await getDownloadURL(
          ref(storage, `images/${currentUser.id}/${selectedImage?.name}`)
        );
        console.log("downloaded URL", downloadURL);
        await axios.post("/api/update", {
          id: currentUser.id,
          field: "image",
          value: downloadURL,
        });
        await fetchType();
      } catch (error) {
        console.error("uploading image", error);
      }
    };
    if (selectedImage) {
      toggleUpload();
    }
  }, [selectedImage?.name]);

  if (loading) {
    return <Load />;
  }

  return (
    <div className=" h-fit pt-24 max-w-2xl shadow sm:rounded-lg mx-auto ">
      {/* Check if currentUser exists before accessing its properties */}
      {currentUser && (
        <div className="h-full">
          <div className="text-center bg-gray-50">
            <div className="relative inline-block">
              <img
                className="w-36 h-36 rounded-full mx-auto"
                src={user?.image || "/images/placeholder.jpg"}
                alt="Rounded avatar"
              />
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FcOldTimeCamera size={25} />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-5 sm:px-6 bg-white p-1">
            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
              {user?.email}&apos;s Profile
            </h3>
          </div>
          <div className="border-t-white">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 w-full">
                <dt className="text-md font-medium text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-1">First Name:</span>
                    <span>
                      <p className="text-red-500">*</p>
                    </span>
                  </div>
                </dt>
                {editModeName ? (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      placeholder={user?.name}
                      onChange={handleChange}
                      className="p-2 font-large text-md mb-3 w-full sm:w-96 rounded-sm border border-[#c7b198] focus:border-[#c7b198] outline-none
                                                transition
                                                disabled:opacity-70
                                                disabled:cursor-not-allowed"
                    />
                    <div className="">
                      <button
                        onClick={handleUpdateSubmit}
                        className="m-auto pr-5 hover:underline"
                      >
                        Save
                      </button>
                      <button onClick={handleClose}>x</button>
                    </div>
                  </dd>
                ) : (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.name}
                    <button onClick={() => handleEditName("name")}>
                      <CiEdit className="w-10 m-auto" />
                    </button>
                  </dd>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 w-full">
                <dt className="text-md font-medium text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-1">Middle Name:</span>
                    <span>
                      <p className="text-red-500">*</p>
                    </span>
                  </div>
                </dt>
                {editModeMName ? (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      placeholder={user?.mname}
                      onChange={handleChange}
                      className="p-2 font-large text-md mb-3 w-full sm:w-96 rounded-sm border border-[#c7b198] focus:border-[#c7b198] outline-none
                                                transition
                                                disabled:opacity-70
                                                disabled:cursor-not-allowed"
                    />
                    <div className="">
                      <button
                        onClick={handleUpdateSubmit}
                        className="m-auto pr-5 hover:underline"
                      >
                        Save
                      </button>
                      <button onClick={handleClose}>x</button>
                    </div>
                  </dd>
                ) : (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.mname}
                    <button onClick={() => handleEditMname("mname")}>
                      <CiEdit className="w-10 m-auto" />
                    </button>
                  </dd>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 w-full">
                <dt className="text-md font-medium text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-1">Last Name:</span>
                    <span>
                      <p className="text-red-500">*</p>
                    </span>
                  </div>
                </dt>
                {editModeLName ? (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      placeholder={user?.lname}
                      onChange={handleChange}
                      className="p-2 font-large text-md mb-3 w-full sm:w-96 rounded-sm border border-[#c7b198] focus:border-[#c7b198] outline-none
                                                transition
                                                disabled:opacity-70
                                                disabled:cursor-not-allowed"
                    />
                    <div className="">
                      <button
                        onClick={handleUpdateSubmit}
                        className="m-auto pr-5 hover:underline"
                      >
                        Save
                      </button>
                      <button onClick={handleClose}>x</button>
                    </div>
                  </dd>
                ) : (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.lname}
                    <button onClick={() => handleEditLname("lname")}>
                      <CiEdit className="w-10 m-auto" />
                    </button>
                  </dd>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 w-full">
                <dt className="text-md font-medium text-gray-500">Gender:</dt>
                {editModeGender ? (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    <label className="mr-4">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        onChange={handleChange}
                      />
                      Male
                    </label>

                    <label className="mr-4">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        onChange={handleChange}
                      />
                      Female
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="others"
                        onChange={handleChange}
                      />
                      Others
                    </label>
                    <div className="">
                      <button
                        onClick={handleUpdateSubmit}
                        className="m-auto pr-5 hover:underline"
                      >
                        Save
                      </button>
                      <button onClick={handleClose}>x</button>
                    </div>
                  </dd>
                ) : (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.gender}
                    <button onClick={() => handleEditGender("gender")}>
                      <CiEdit className="w-10 m-auto" />
                    </button>
                  </dd>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 w-full">
                <dt className="text-md font-medium text-gray-500">
                  Birthdate:
                </dt>
                {editModeBirthdate ? (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="date"
                      placeholder={user?.Birthdate}
                      onChange={handleChange}
                      className="p-2 font-large text-md mb-3 w-full sm:w-96 rounded-sm border border-[#c7b198] focus:border-[#c7b198] outline-none
                                                transition
                                                disabled:opacity-70
                                                disabled:cursor-not-allowed"
                    />
                    <div className="">
                      <button
                        onClick={handleUpdateSubmit}
                        className="m-auto pr-5 hover:underline"
                      >
                        Save
                      </button>
                      <button onClick={handleClose}>x</button>
                    </div>
                  </dd>
                ) : (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    {currentUser?.Birthdate ? (
                      <>
                        {new Date(user?.Birthdate)
                          .toDateString()
                          .replace(/\sGMT.*$/, "")}
                      </>
                    ) : (
                      <></>
                    )}
                    <button onClick={() => handleEditBirthdate("Birthdate")}>
                      <CiEdit className="w-10 m-auto" />
                    </button>
                  </dd>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 w-full">
                <dt className="text-md font-medium text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-1">Email/Username:</span>
                    <span>
                      <p className="text-red-500">*</p>
                    </span>
                  </div>
                </dt>
                {editModeEmail ? (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="email"
                      placeholder={user?.email}
                      onChange={handleChange}
                      className="p-2 font-large text-md mb-3 w-full sm:w-96 rounded-sm border border-[#c7b198] focus:border-[#c7b198] outline-none
                                                transition
                                                disabled:opacity-70
                                                disabled:cursor-not-allowed"
                    />
                    <div className="">
                      <button
                        onClick={handleUpdateSubmit}
                        className="m-auto pr-5 hover:underline"
                      >
                        Save
                      </button>
                      <button onClick={handleClose}>x</button>
                    </div>
                  </dd>
                ) : (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.email}
                    <button onClick={() => handleEditEmail("email")}>
                      <CiEdit className="w-10 m-auto" />
                    </button>
                  </dd>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 w-full">
                <dt className="text-md font-medium text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-1">Current Address:</span>
                    <span>
                      <p className="text-red-500">*</p>
                    </span>
                  </div>
                </dt>
                {editModeAddress ? (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="email"
                      placeholder={user?.Address}
                      onChange={handleChange}
                      className="p-2 font-large text-md mb-3 w-full sm:w-96 rounded-sm border border-[#c7b198] focus:border-[#c7b198] outline-none
                                                transition
                                                disabled:opacity-70
                                                disabled:cursor-not-allowed"
                    />
                    <div className="">
                      <button
                        onClick={handleUpdateSubmit}
                        className="m-auto pr-5 hover:underline"
                      >
                        Save
                      </button>
                      <button onClick={handleClose}>x</button>
                    </div>
                  </dd>
                ) : (
                  <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.Address}
                    <button onClick={() => handleEditAddress("Address")}>
                      <CiEdit className="w-10 m-auto" />
                    </button>
                  </dd>
                )}
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
