"use client";
import React, { useEffect, useState } from "react";
import Load from "./Load";
import CopyButton from "./CopyButton";
import { useRouter } from "next/navigation";

const VoucherList = ({ currentUser }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [voucherData, setVoucherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const res = await fetch(`/api/getAllVoucher/${currentUser?.id}`);
          const data = await res.json();
          setVoucherData(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }else{
        router.push("/");
      }
    };

    fetchData();
  }, [currentUser?.id]);

  if (loading) {
    return <Load />;
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-fullscreen bg-cover bg-center w-10/12 pt-28 m-auto pb-20"
      style={{}}
    >
      <div
        className="w-full border-solid border-2 rounded-lg mb-5"
        style={{ borderColor: "#c7b198" }}
      >
        <h1 className="sm:text-left text-center text-3xl font-bold m-10 ">
          Available Voucher Codes
        </h1>
      </div>
      <table className="table-auto w-1/2">
        <thead>
          <tr className="font-bold text-2xl">
            <th>
              <div className="border-solid border-2 border-sky-500 rounded-md bg-sky-200">
                Partner
              </div>
            </th>
            <th>
              <div className="border-solid border-2 border-sky-500 rounded-md bg-sky-200">
                Use Code
              </div>
            </th>
            <th>
              <div className="border-solid border-2 border-sky-500 rounded-md bg-sky-200">
                Offer
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {voucherData.map((voucher, index) => (
            <tr key={index}>
              <td
                onClick={() => {
                  router.push(`/spaProfile?listingId=${voucher.spaId}`);
                }}
              >
                <img
                  className="h-48 w-48 m-auto cursor-pointer"
                  src={voucher.spa.image}
                  alt="image"
                />
              </td>
              <td className="text-center font-bold text-2xl text-cyan-500 m-auto">
                <div className="flex justify-center items-center gap-2">
                  {voucher.code}
                  <CopyButton textToCopy={voucher.code} />
                </div>
              </td>
              <td className="text-center font-bold text-2xl text-cyan-500">
                ₱{voucher.value.toFixed(2)} Off
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherList;
