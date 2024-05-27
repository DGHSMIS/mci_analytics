"use client";
import { getAPIResponse } from '@library/utils';
import { inter, nikosh } from '@utils/fonts';
import { HealthCard } from '@utils/interfaces/HealthCard/HealthCard';
import { getBaseUrl } from '@utils/lib/apiList';
import { delay } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';
import QRCode, { QRCodeToDataURLOptions } from 'qrcode';
import { useEffect, useRef, useState } from 'react';
import { cn } from 'tailwind-cn';
interface HealthCardPrintInterface {
  healthCard2: HealthCard;
  template2: string;
}
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "auto";
export const dynamicParams = true;

// export default function GenerateImage(params: HealthCardPrintInterface) {
export default function GenerateImage() {
  const router = useRouter();
  const commonClass = `${nikosh.className} p-0 m-0 relative w-[1024px]`;
  const imageWidth = 80;
  const imageHeight = 100;

  const template = '/img/templates/nid_temp.png';
  const searchParams = useSearchParams();
  const healthCardParam = searchParams.get('healthCardInfo');
  const healthCardInfo = healthCardParam ? JSON.parse(healthCardParam) : null;
  if (healthCardInfo == null) {
    return null;
  }
  try{
    let healthCard = healthCardInfo as HealthCard;
  } catch(e){
    return null;
  }
  const healthCard = healthCardInfo as HealthCard;
  console.log("healthCard.bloodGroup");
  console.log(healthCard.bloodGroup);
  if (healthCard == null) {
    return null;
  }




  const ref = useRef<HTMLDivElement>(null);
  const [imageDataUri, setImageDataUri] = useState('');
  const [bufferQRDataUri, setBufferQRDataUri] = useState('');
  const [bufferBarCodeDataUri, setBufferBarCodeDataUri] = useState('');


  useEffect(() => {
    var opts: QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 0.5,
      color: {
        dark: "#000000",
        light: "#daeef9"
      }
    }
    //fetch bar code without caching with no
    getAPIResponse(getBaseUrl(), `/api/es/patient/get-patient-card-barcode?hid=${healthCard.health_id}`, '', 'GET', null, false, 0).then((response) => {
      setBufferBarCodeDataUri(response.barCodeURI);
    });
    QRCode.toDataURL(healthCard.health_id, opts).then((uri) => {
      setBufferQRDataUri(uri);
    })
    
    
    //fetch nid photo without caching with no
    if(healthCard.nationalId){
      console.log("The NID Image Data from " + healthCard.nationalId);
        getNIDImage(healthCard.nationalId);
      }

  }, [])

  const getNIDImage = async (nid:String) => {
    await getAPIResponse(getBaseUrl(), `/api/es/patient/get-patient-nid-photo?nid=${nid}`, '', 'GET', null, false, 0).then((response) => {
      console.log("The NID Image Data from " + healthCard.nationalId);
      console.log(response);
      setImageDataUri(response.imgURI);
    });
  }
  const TemplateBuilder = () => <div id='templateBuilder' ref={ref} className={cn(`${commonClass}`)} >
    <img className="w-full h-auto" src={template} alt="Health Card" />
    <div className="absolute top-[0] left- w-[1024px]">
      <div className='grid grid-cols-2 gap-x-12'>
        <div className='col-start-2 col-span-1 flex items-center justify-center h-[100px]'>
          {/* <img src={`https://placehold.co/400x50/png`} alt={`${healthCard.nameEn}'s Image`} className="userImg" /> */}
          <img src={bufferBarCodeDataUri} alt={`${healthCard.nameEn}'s Bar Code`} className="barcodeImg" />
        </div>
        <div className='col-span-1 grid grid-cols-6 space-x-8 relative mt-[5px]'>
          <p className={cn(`col-span-6 text-center w-full text-[20px] font-semibold text-black ${inter.className}`)}>{healthCard.health_id}</p>
          <div className='col-span-1'>
            <div className='flex align-start justify-center space-4 pt-4 relative h-full w-full'>
              {imageDataUri.length >0 ?
                <img
                  src={`${imageDataUri}`}
                  alt={`${healthCard.nameEn}'s Image`}
                  className="userImg"
                /> : <div className='w-[70px] h-[80px] border-dotted border-slate-300 border-2 border-opacity-50'></div>}
            </div>
          </div>
          <div className='col-span-5 grid grid-cols-2'>
            <div className='col-span-1'>
              <p className='text-base leading-[1.5rem] text-black'>নাম: {healthCard.nameBn}</p>
              <p><span className={cn("text-xs leading-[1.5rem] text-black", `${inter.className}`)}> Name: {healthCard.nameEn}</span></p>
              <p className='text-base leading-[1.5rem] text-black'>পিতা: {healthCard.fatherNameBn}</p>
              <p className='text-base leading-[1.5rem] text-black'>মাতা: {healthCard.motherNameBn}</p>
              <p className={cn("text-base leading-[1.5rem] text-black relative", `${nikosh.className}`)}><span className='text-base leading-[1.5rem] text-black'>হেলথ আইডি: </span><span className={cn(`text-xs text-black leading-[1.5rem] font-semibold ${inter.className}`)}>{healthCard.health_id}</span></p>
            </div>
            <div className='col-span-1'>
              <p className='text-base leading-[1.5rem] text-black'><span className='text-base text-black'>জন্ম তারিখ:</span> <span className={cn(`leading-[1.5rem] text-xs text-black ${inter.className}`)}> {healthCard.dob}</span></p>
              <p className='text-base leading-[1.5rem] text-black'>লিঙ্গ: {healthCard.genderBn}</p>
              <p className={cn("text-base leading-[1.5rem] text-black", `${nikosh.className}`)}><span className='text-base leading-[1.5rem] text-black'>রক্তের গ্রূপ:</span><span className={cn(`leading-[1.5rem] text-xs text-black ${inter.className}`)}> {healthCard.bloodGroup}</span></p>
            </div>
          </div>
        </div>
        <div className='col-span-1 grid grid-cols-6 pl-20 flex-col align-middle justify-start mt-[10px]'>
          <div className='col-span-4'>
            <p className={cn("text-base leading-[1.5rem] text-black", `${nikosh.className}`)}>স্থায়ী ঠিকানা: {healthCard.address}</p>
            <p className={cn("text-base leading-[1.5rem] text-black", `${nikosh.className} relative`)}><span className='text-base leading-[1.5rem] text-black'>প্রদানের তারিখ: </span><span className={cn(`leading-[1.5rem] text-xs text-black ${inter.className}`)}>{healthCard.dateProvided}</span></p>
          </div>
          <div className='col-span-2'>
            <img src={bufferQRDataUri} className='qrCodeImg' width="80x" height="80px" />
          </div>
        </div>
      </div>
      {/* Add more details here if needed */}
    </div>
  </div>



  return (<>
    {/* StartOf{imageDataUri.length>0 && String(imageDataUri)}EndOf */}
    {/* <b>HTML Generated</b> */}
    <TemplateBuilder />
    {/* {imageDataUri && <>
      <b>Generated Image</b>
      <img src={imageDataUri} alt="Generated Health Card" className={cn(`${commonClass}`)} /></>} */}
  </>)
};



