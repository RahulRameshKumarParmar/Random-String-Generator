import { PiSwapBold } from 'react-icons/pi';
import './App.css';
import { useCallback, useEffect, useState } from 'react';
import { IoMdWarning } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';
import { FaRegCopy, FaTrashAlt } from 'react-icons/fa';
import { TiTick } from 'react-icons/ti';

function App() {

  const [stringLength, setStringLength] = useState<number>(5);
  const [lowerCase, setLowerCase] = useState<boolean>(false);
  const [upperCase, setUpperCase] = useState<boolean>(false);
  const [number, setNumber] = useState<boolean>(false);
  const [specialCharacters, setSpecialCharacters] = useState<boolean>(false);
  const [keepHistory, setKeepHistory] = useState<boolean>(true);
  const [randomString, setRandomString] = useState<string>("");
  const [stringsHistory, setStringsHistory] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [singleCopy, setSingleCopy] = useState<boolean[]>(Array(stringsHistory.length).fill(false));
  console.log(singleCopy);

  const generatingString = useCallback(() => {
    if (!lowerCase && !upperCase && !number && !specialCharacters) {
      toast.error("Please select one of the checkbox to create string")
    }
    else {
      let letters: string = "";
      if (lowerCase) {
        letters += "abcdefghijklmnopqrstuvwxyz";
      }
      if (upperCase) {
        letters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      }
      if (number) {
        letters += "0123456789";
      }
      if (specialCharacters) {
        letters += "!@#$%^&*~?/";
      }

      let chars: string = "";
      for (let i = 0; i < stringLength; i++) {
        chars += letters.charAt(Math.floor(Math.random() * letters.length))
      }
      setRandomString(chars);
    }
  }, [stringLength, lowerCase, upperCase, number, specialCharacters])

  const copy = useCallback(() => {
    navigator.clipboard.writeText(randomString);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
    setIsCopied(true);
  }, [randomString]);

  const selectiveCopy = useCallback((id: number) => {
    navigator.clipboard.writeText(stringsHistory[id]);
    setSingleCopy((prev) => {
      const newCopy = [...prev];
      newCopy[id] = true;
      return newCopy
    });
    
    setTimeout(() => {
      setSingleCopy((prev) => {
        const newCopy = [...prev];
        newCopy[id] = false;
        return newCopy;
      })
    }, 1500);
  }, [stringsHistory])

  useEffect(() => {
    const existingString = localStorage.getItem("words");
    const history: string[] = existingString ? JSON.parse(existingString) : [];
    setStringsHistory(history);
  }, []);

  useEffect(() => {
    if (randomString && keepHistory) {
      const existingString = localStorage.getItem("words");
      const history: string[] = existingString ? JSON.parse(existingString) : [];
      const allHistory: string[] = [...history, randomString]
      localStorage.setItem("words", JSON.stringify(allHistory));
      setStringsHistory(allHistory);
    }
  }, [randomString]);

  const deleteString = (id: number) => {
    const newStringHistory = stringsHistory.filter((_, i) => i !== id);
    setStringsHistory(newStringHistory);
    localStorage.setItem("words", JSON.stringify(newStringHistory));
  }

  const clearHistory = () => {
    setStringsHistory([]);
    localStorage.setItem("words", JSON.stringify([]));
  }

  return (
    <>
      <header className='mt-5 flex flex-col justify-center items-center gap-2'>
        <PiSwapBold className='bg-blue-600 text-white p-2 rounded-full' size={50} />
        <h1 className='text-[2rem] font-bold'>Random String Generator</h1>
        <p>Generate random strings with customizable options</p>
      </header>

      <main className='w-[50%] m-auto mt-5 mb-5 bg-white shadow-xl rounded-xl p-5 px-5 transition-all ease-in'>
        <Toaster position='top-right' />
        <div>
          <h3 className='text-[1.2rem] font-bold'>Generation Settings</h3>
          <div className='mt-2 font-medium'>String Length: <b className='text-blue-500'>{stringLength}</b></div>
          <span className='flex items-center justify-between'>
            <input className='mt-4 mb-5 appearance-none bg-[#f5f5f5] h-[0.5rem] w-[83%] rounded-2xl' type="range" min="5" max="25" value={stringLength} onChange={(e) => setStringLength(Number(e.target.value))} />

            <input className='text-center border border-gray-200 bg-gray-100 px-2 py-1 rounded' type="number" min='5' max='25' readOnly onChange={(event) => setStringLength(Number(event.target.value))} value={stringLength} />
          </span>
        </div>

        <div>
          <h3 className='text-[1rem] tracking-wide font-semibold mt-3'>Character Sets</h3>
        </div>
        <div className='mt-3 mb-4 flex items-center gap-3'>
          <div>
            <input className='w-[1rem] h-[1rem] cursor-pointer' onChange={(e) => setLowerCase(e.target.checked)} type="checkbox" />
          </div>
          <div>
            <label className='font-medium'>LowerCase Letters</label>
            <p className='text-gray-400 font-semibold -mt-1'>a-z</p>
          </div>
        </div>
        <div className='mt-3 mb-4 flex items-center gap-3'>
          <div>
            <input className='w-[1rem] h-[1rem] cursor-pointer' onChange={(e) => setUpperCase(e.target.checked)} type="checkbox" />
          </div>
          <div>
            <label className='font-medium'>UpperCase Letters</label>
            <p className='text-gray-400 font-semibold'>A-Z</p>
          </div>
        </div>

        <div className='mt-3 mb-4 flex items-center gap-3'>
          <div>
            <input className='w-[1rem] h-[1rem] cursor-pointer' onChange={(e) => setNumber(e.target.checked)} type="checkbox" />
          </div>
          <div>
            <label className='font-medium'>Numbers</label>
            <p className='text-gray-400 font-semibold'>0-9</p>
          </div>
        </div>

        <div className='mt-3 mb-4 flex items-center gap-3'>
          <div>
            <input className='w-[1rem] h-[1rem] cursor-pointer' onChange={(e) => setSpecialCharacters(e.target.checked)} type="checkbox" />
          </div>
          <div>
            <label className='font-medium'>Special Characters</label>
            <p className='text-gray-400 font-semibold'>#$!@%...</p>
          </div>
        </div>

        <div className='mt-3 mb-4 flex items-center gap-3'>
          <div>
            <input checked={keepHistory} onChange={(e) => setKeepHistory(e.target.checked)} className='w-[1rem] h-[1rem] cursor-pointer rounded' type="checkbox" />
          </div>
          <div>
            <label className='font-medium'>Save Generation History</label>
            <p className='text-gray-400 font-semibold flex items-center gap-2'> <IoMdWarning className='text-amber-300' /> Not recommended for sensitive strings like passwords </p>
          </div>
        </div>

        <div className='mb-5'>
          <button onClick={() => generatingString()} className='bg-blue-600 flex items-center justify-center gap-3 text-white cursor-pointer p-3 rounded-lg w-[100%] h-[2.5rem] hover:bg-blue-500 font-semibold'><PiSwapBold className='text-white' size={23} /> Generate Random String</button>
        </div>

        <hr className="-ms-4 border-t-2 w-[105%] border-gray-300 my-5" />

        <div className='relative pb-4'>
          <h3 className='font-bold text-[1.1rem]'>Generated String</h3>
          <input className='ps-5 mt-5 border-1 border-gray-300 rounded-lg w-[100%] h-[3rem] bg-gray-200 placeholder:ps-5 tracking-wider font-medium' value={(randomString) ? randomString : ""} placeholder='Click  "Generate Random String"  to create a new string' type="text" readOnly />
          <button className={`absolute bottom-7 right-3 cursor-pointer gap-2 ${randomString === "" ? "hidden" : "flex items-center"} ${isCopied ? "text-green-800" : "text-black"}`} onClick={copy}> {isCopied ? <TiTick color='green' /> : <FaRegCopy />}   {isCopied ? "Copied" : "Copy"} </button>
        </div>
      </main>

      <section className={`${stringsHistory.length > 0 ? "block" : "hidden"} w-[50%] m-auto mt-5 mb-5 bg-white shadow-xl rounded-xl p-5 px-5 transition-all ease-in`}>
        <div>
          <h3 className='font-bold text-[1.1rem]'>Recent Generations</h3>
          <ul className='mt-5'>
            {stringsHistory.map((string, index) => {
              return (
                <div className='relative w-[100%] flex items-center justify-center gap-4' key={index}>
                  <li className='border-1 border-gray-300 rounded-lg w-[100%] h-[3rem] mb-2 p-3 ps-4 bg-gray-200'>{string}</li>
                  <button
                    className={`absolute right-12 top-4 cursor-pointer ${singleCopy[index] ? "text-green-800" : "text-black"}`} onClick={() => selectiveCopy(index)}>
                    {singleCopy[index] ? <TiTick color='green' /> : <FaRegCopy />}
                  </button>
                  <button
                    onClick={() => deleteString(index)} className='absolute right-1 bottom-3 p-3 cursor-pointer text-red-600 rounded-xl'><FaTrashAlt />
                  </button>
                </div>
              )
            })}
          </ul>
          <button className='mt-3 ms-3 mb-5 flex items-center gap-2 cursor-pointer text-red-500' onClick={() => clearHistory()}> <FaTrashAlt className='text-red-500'/> Clear History</button>
        </div>
      </section>
    </>
  )
}

export default App
