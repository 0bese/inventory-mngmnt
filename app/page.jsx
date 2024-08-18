"use client";
import { useEffect, useRef, useState } from "react";
import { firestore } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { Trash, CirclePlus } from "lucide-react";
import Webcam from "react-webcam";
import Image from "next/image";
import axios from "axios";
// import { load as cocoSSDLload } from "@tensorflow-models/coco-ssd";
// import * as tf from "@tensorflow/tfjs";
// import { renderPredictions } from "@/utils/render-predictions";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCam, setOpenCam] = useState(false);
  const [itemName, setItemName] = useState("");
  const [imgSrc, setImgSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const { messages, input, handleInputChange, handleSubmit } = useChat();

  async function handleImageInput() {
    try {
      const result = await axios.post("api/genai", { img: imgSrc });
      if (result) {
        let response = JSON.stringify(result);
        let invntryItm = JSON.parse(JSON.parse(response).data);
        addItem(invntryItm.itemName);
        setImgSrc(null);
        // console.log(invntryItm);
      }
    } catch (error) {
      console.log(`This error is from HomePage.tsx 🚀: ${error}`);
    }
  }

  //inventory
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  //modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //camera
  const handleOpenCam = () => setOpenCam(true);
  const handleCloseCam = () => setOpenCam(false);

  return (
    <div className="w-[100vw] h-screen bg-slate-200 ">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3">
        <h1 className="text-3xl sm:text-5xl">Inventory Management</h1>
        <div className="flex flex-row gap-5">
          <button
            className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounde- shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => handleOpen()}
          >
            Add New Items
          </button>
          <button
            className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => handleOpenCam()}
          >
            Add via Cam
          </button>
        </div>
        {inventory.map(({ name, quantity }) => (
          <div
            key={name}
            className="flex w-full bg-gradient-to-l from-blue-50 via-blue-200 to-blue-100 shadow-sm h-20 rounded-lg justify-between items-center mx-auto border-4 border-white"
          >
            <div className="p-10">
              <p className="text-4xl">{name}</p>
            </div>
            <div className="flex items-center justify-center gap-4 text-4xl mx-4 ">
              <div className="px-5 ">{quantity}</div>
              <button
                onClick={() => removeItem(name)}
                className="bg-red-400 px-5 py-3 rounded-lg hover:bg-red-500"
              >
                <Trash color="white" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* via text */}
      <>
        {open ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Add New Item</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => handleClose()}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <textarea
                      onChange={(e) => {
                        setItemName(e.target.value);
                      }}
                      type="text"
                      placeholder="Add item..."
                      className="w-full h-20 p-4 border border-green-500 rounded-lg focus:outline-green-600"
                    />
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => handleClose()}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        addItem(itemName.toLowerCase().trim());
                        setItemName("");
                        handleClose();
                      }}
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>

      {/* camera */}
      <>
        {openCam ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Add New Item</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => handleCloseCam()}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <div className="relative">
                      {imgSrc == null ? (
                        <>
                          <Webcam
                            mirrored={true}
                            screenshotFormat="image/jpeg"
                            muted
                            className="rounded-lg w-full"
                          >
                            {({ getScreenshot }) => (
                              <button
                                className="bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm my-4 px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => {
                                  let imageSrc = getScreenshot();
                                  setImgSrc(imageSrc);
                                }}
                              >
                                Take Photo
                              </button>
                            )}
                          </Webcam>
                        </>
                      ) : (
                        <>
                          <Image
                            src={imgSrc}
                            width={500}
                            height={500}
                            alt="smth"
                          />
                          <button onClick={handleImageInput}> Add item</button>
                          <button onClick={() => setImgSrc(null)}>
                            {" "}
                            retake
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        handleCloseCam();
                        setImgSrc(null);
                      }}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        handleImageInput();
                        handleCloseCam();
                      }}
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    </div>
  );
}
