import { PiSwapBold } from 'react-icons/pi';
import './App.css';
import { useCallback, useState } from 'react';
import { IoIosWarning } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';

function App() {

  const [stringLength, setStringLength] = useState<number>(5);
  const [lowerCase, setLowerCase] = useState<boolean>(false);
  const [upperCase, setUpperCase] = useState<boolean>(false);
  const [number, setNumber] = useState<boolean>(false);
  const [specialCharacters, setSpecialCharacters] = useState<boolean>(false);
  const [randomString, setRandomString] = useState<string>("");

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
      for (let i = 0; i <= stringLength; i++) {
        chars += letters.charAt(Math.floor(Math.random() * letters.length))
      }
      setRandomString(chars);
    }
  }, [stringLength, lowerCase, upperCase, number, specialCharacters])

  const copy = useCallback(() => {
    navigator.clipboard.writeText(randomString);
  }, [randomString]);

  

  return (
    <>
      <header className='mt-5 flex flex-col justify-center items-center gap-2'>
        <PiSwapBold className='bg-blue-400 text-white p-2 rounded-full' size={50} />
        <h1 className='text-[2rem] font-bold'>Random String Generator</h1>
        <p>Generate random strings with customizable options</p>
      </header>

      <main className='text-center'>
        <Toaster position='top-right' />
        <div>
          <h3 className='text-[1.2rem] font-bold'>Generation Settings</h3>
          <div>String Length: {stringLength}</div>
          <span>
            <input type="range" min="5" max="25" value={stringLength} onChange={(e) => setStringLength(Number(e.target.value))} />
            <input type="number" min='5' max='25' readOnly onChange={(event) => setStringLength(Number(event.target.value))} value={stringLength} />
          </span>
        </div>

        <div>
          <h3 className='text-[1.2rem] font-bold'>Character Sets</h3>
        </div>
        <div>
          <span>
            <input onChange={(e) => setLowerCase(e.target.checked)} type="checkbox" />
            <label>LowerCase Letters</label>
          </span>
          <p>a-z</p>
        </div>
        <div>
          <span>
            <input onChange={(e) => setUpperCase(e.target.checked)} type="checkbox" />
            <label>UpperCase Letters</label>
          </span>
          <p>A-Z</p>
        </div>
        <div>
          <span>
            <input onChange={(e) => setNumber(e.target.checked)} type="checkbox" />
            <label>Numbers</label>
          </span>
          <p>0-9</p>
        </div>
        <div>
          <span>
            <input onChange={(e) => setSpecialCharacters(e.target.checked)} type="checkbox" />
            <label>Special Characters</label>
          </span>
          <p>#$!@%...</p>
        </div>
        <div>
          <span>
            <input type="checkbox" />
            <label>Save Generation History</label>
          </span>
          <p> <IoIosWarning /> Not recommended for sensitive strings like passwords </p>
        </div>
        <div>
          <button onClick={() => generatingString()} className='bg-blue-400 flex items-center justify-center text-white cursor-pointer p-3 rounded-lg'><PiSwapBold className='text-white' size={30} /> Generate Random String</button>
        </div>

        <div>
          <h3>Generated String</h3>
          <input className='w-[40vw] h-[3rem] placeholder:ps-5' value={(randomString) ? randomString : ""} placeholder='Click "Generate Random String" to create a new string' type="text" readOnly />
          <button className='cursor-pointer' onClick={copy}>Copy</button>
        </div>
      </main>

      <section className='text-center'>
        <div>
          <h3>Recent Generations</h3>
          <input className='w-[40vw] h-[3rem] placeholder:ps-5' placeholder='Click "Generate Random String" to create a new string' type="text" readOnly />
        </div>
      </section>
    </>
  )
}

export default App
