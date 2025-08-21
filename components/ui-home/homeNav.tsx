// import React from 'react'
import Image from 'next/image'
import Login from '../ui-login/login'

const HomeNav = () => {
  return (
      <div className='flex px-[20px] py-[10px] justify-between items-center h-[10vh]' >
        <div className='text-black'>            
            <Image
                src={"/images/sei-logo.svg"}
                alt="SEI"
               width={50}
               height={50}
            />
        </div>
        <div className='font-marvin text-[35px] flex flex-row gap-3'>
            <Image
              src={"/images/logo.svg"}
              alt='.'
              width={30}
              height={30}
            />
            SeiTrage
        </div>
        <div><Login/></div>
      </div>

  )
}

export default HomeNav
