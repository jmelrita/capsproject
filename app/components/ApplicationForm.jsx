"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { storage } from "../config";
import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytes } from "firebase/storage";

const ApplicationForm = () => {
  const searchParams = useSearchParams();
  const spaId = searchParams.get("ID");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modal, setModal] = useState(false);
  const initialFormData = {
    // Define initial values for form fields
    spaId: spaId,
    gender: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    birthdate: "",
    address: "",
    image: "",
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Access the form data from the state
    console.log(formData);

    // Here you can perform any further actions like sending the data to an API
    // Check if any required fields are empty
    if (
      !formData.firstName ||
      !formData.middleName ||
      !formData.lastName ||
      !formData.gender ||
      !formData.address ||
      !formData.address ||
      !formData.birthdate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    const fileRef = ref(
      storage,
      `images/TherapistIdCards/${formData.image.name}`
    );
    const snapshot = await uploadBytes(fileRef, formData.image);
    const downloadURL = await getDownloadURL(
      ref(storage, `images/TherapistIdCards/${formData.image.name}`)
    );
    console.log("downloaded URL", downloadURL);

    try {
      const Data = new FormData();
      const birthdate = new Date(formData.birthdate).toISOString();
      Data.append("spaId", formData.spaId);
      Data.append("gender", formData.gender);
      Data.append("firstName", formData.firstName);
      Data.append("middleName", formData.middleName);
      Data.append("lastName", formData.lastName);
      Data.append("phoneNumber", formData.phoneNumber);
      Data.append("birthdate", birthdate);
      Data.append("address", formData.address);
      Data.append("image", downloadURL);

      const formDataJSON = {};
      for (const [key, value] of Data.entries()) {
        formDataJSON[key] = value;
      }

      axios
        .post("/api/createTherapist", formDataJSON)
        .then(() => {
          setFormData({ ...initialFormData });
          setModal(true);

          //location.reload();
        })
        .catch((error) => {
          toast.error("Something went wrong");
        });
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the form data state with the new value
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0]);
    setFormData({
      ...formData,
      image: event.target.files[0],
    });
  };

  const toggle = () => {
    setModal(false);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center w-10/12 pt-32 m-auto pb-24">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="bg-[#96766C] absolute inset-0 shadow-lg transform -skew-y-10 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>

          <div className="relative px-8 py-10 bg-white border shadow-lg sm:rounded-3xl sm:p-20">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
              Masseur/Masseuse Application
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div style={{ textAlign: "center" }}>
                <h3>What&apos;s your gender?</h3>
              </div>
              <div className="flex justify-center items-center space-x-4">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  className="h-4 w-4  focus:border-gray-300 rounded"
                  onChange={handleInputChange}
                />
                <label htmlFor="male" className="font-medium text-gray-700">
                  Male
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  className="h-4 w-4  focus:border-gray-300 rounded"
                  onChange={handleInputChange}
                />
                <label htmlFor="female" className="font-medium text-gray-700">
                  Female
                </label>
                <input
                  type="radio"
                  id="Others"
                  name="gender"
                  value="Others"
                  className="h-4 w-4  focus:border-gray-300 rounded"
                  onChange={handleInputChange}
                />
                <label htmlFor="female" className="font-medium text-gray-700">
                  Others
                </label>
              </div>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  onChange={handleInputChange}
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  className=" bg-white border shadow-lg mt-1 focus:block w-full px-5 py-2 sm:w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your first name"
                  style={{ borderColor: "black" }}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Middle Name
                </label>
                <input
                  type="text"
                  onChange={handleInputChange}
                  id="middleName"
                  value={formData.middleName}
                  name="middleName"
                  className="bg-white border shadow-lg mt-1 focus:block w-full px-5 py-2 sm:w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your last name"
                  style={{ borderColor: "black" }}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  onChange={handleInputChange}
                  id="lastName"
                  value={formData.lastName}
                  name="lastName"
                  className="bg-white border shadow-lg mt-1 focus:block w-full px-5 py-2 sm:w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your last name"
                  style={{ borderColor: "black" }}
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  onChange={handleInputChange}
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  name="phoneNumber"
                  className="bg-white border shadow-lg mt-1 focus:block w-full px-5 py-2 sm:w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your phone number"
                  style={{ borderColor: "black" }}
                />
              </div>
              <div>
                <label
                  htmlFor="birthdate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Birthdate
                </label>
                <input
                  type="date"
                  onChange={handleInputChange}
                  id="birthdate"
                  value={formData.birthdate}
                  name="birthdate"
                  className="bg-white border shadow-lg mt-1 focus:block w-full px-5 py-2 sm:w-full sm:text-sm border-gray-300 rounded-md"
                  style={{ borderColor: "black" }}
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  onChange={handleInputChange}
                  id="address"
                  value={formData.address}
                  name="address"
                  className="bg-white border shadow-lg mt-1 focus:block w-full px-5 py-2 sm:w-full sm:text-sm border-black rounded-md"
                  placeholder="Enter your address"
                  style={{ borderColor: "black" }}
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  PWD ID CARD or Any Identification Card
                </label>
                <input
                  type="file"
                  id="image-upload"
                  name="image"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-w-md"
                  onChange={handleImageUpload}
                />
              </div>

              {formData.image && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Uploaded image"
                  className="h-36 m-auto"
                />
              )}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white hover:focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: "#96766C" }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      {modal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 mt-11">
          <div className="bg-white p-8 rounded-md w-10/12 md:w-1/2 lg:w-4/12 pt-5">
            <h1
              className="text-right font-bold mb-1 cursor-pointer "
              onClick={toggle}
            >
              X
            </h1>
            <h1 className="text-center font-bold mb-0">
              Thank you for submitting an application for your PWD family member
              or friend!
            </h1>
            <p>
              *Please inform them that they can expect a call from us to discuss
              further details. Alternatively, they are welcome to visit our spa
              directly to confirm their application and begin their employment
              whenever they&apos;re ready.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationForm;
