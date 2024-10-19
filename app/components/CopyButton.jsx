import React, { useState } from 'react';
import { FaCopy } from "react-icons/fa6";
import { LuCopyCheck } from "react-icons/lu";


const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);

    // Reset copied state after a short delay   
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div>
      
      {copied ? <LuCopyCheck /> : <FaCopy onClick={copyToClipboard} className='cursor-pointer' />}
    </div>
  );
};

export default CopyButton;
