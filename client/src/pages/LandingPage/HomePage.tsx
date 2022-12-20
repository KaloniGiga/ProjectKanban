import HomePageImage from '../../assets/HomePageImage.jpg';

function HomePage() {

  return (
    //wrapper container
    <div className='flex justify-between' >
      {/* left seciton */}
      <section className=' pl-6 pt-3 bg-surface basis-1/2'>

      <div className='flex flex-col mb-2 px-5 py-3 border-b-2 border-black' style={{minHeight: '182px'}}>

        <h2 className='font-bold text-xl mb-4'>Recently Viewed</h2>
        {/* Recent Boards component */}

      </div>

      <div className='flex flex-col mb-2 px-5 py-3 border-b-2 border-black' style={{minHeight: '181px'}}>
         <h2 className='font-bold text-xl mb-4'>Your Workspaces</h2>
         {/* Workspaces component */}
      </div>

      <div className='flex flex-col px-5 py-3 border-b-2 border-black' style={{minHeight: '183px'}}>
        <h2 className='font-bold text-xl mb-4'>Your Tasks</h2>
        {/* Your tasks */}
      </div>

      </section>
       
       {/* Right section */}
      <section className=' basis-1/2 mt-3 bg-surface flex justify-center'>
          <div className='pb-4 rounded drop-shadow-xl' style={{maxHeight: '270px', minHeight: '170px'}}>

              <img src={HomePageImage} alt="Home page image" className='text-center w-full max-w-md' style={{maxHeight: '180px'}}/>
            
            <div>
              <h3 className='text-center font-bold my-3'>Manage Projects</h3>
              <p className='px-3 text-center'>Invite members to your boards and track all the tasks.</p>
            </div>

          </div>
      </section>

    </div>
  )
}

export default HomePage