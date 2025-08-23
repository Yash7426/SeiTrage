// import React from 'react'
import Image from 'next/image'
import Login from '../ui-login/login'

const HomeNav = () => {
  return (
      <div className='flex px-[20px] py-[10px] justify-between items-center h-[10vh]' >
        <div className='text-black'>            
            <Image
                src={"/images/sei_logo.svg"}
                alt="SEI"
               width={80}
               height={80}
            />
        </div>
        <div className='font-bebas text-[35px] flex flex-row items-center align-center'>
            <Image
              src={"/images/seitrage_logo.svg"}
              alt='.'
              width={40}
              height={40}
            />
        </div>
        <div><Login/></div>
      </div>

  )
}

export default HomeNav
