import React from 'react'

const About = () => {
    return (
        <div className='min-h-screen bg-gray-50 flex flex-col items-center'>
            {/* {content} */}
            <div className="w-full max-w-6xl px-6 py-12 md:py-16">
                <div className="grid grid-col-1 md:grid-cols-2 gap-8 items-center">
                    {/* {left} */}
                 
                 <div className="div">
                    <h2 className='text-3xl font-bold text-gray-800 mb-4'>Who we Are</h2>

                    <p className='text-gray-600 leading-relaxed'> 
                        We are passionate team committed to driving change through innovation and collaborations. Our platform is designed to empower individuals and organizations to unlock their potential.
                    </p>
                 </div>
                    {/* {right} */}

                    <div className="relative">
                        <img src="https://images.pexels.com/photos/4057663/pexels-photo-4057663.jpeg"
                        alt=""
                        className='rounded-lg shadow-lg hover:scale-105 transition-transform duration-300'
                        ></img>
                    </div>
                </div>
            </div>

            {/* {team section} */}
            <div className="w-full bg-gray-100 py-12">
                <h2 className='text-3xl font-bold text-gray-800 text-center mb-8'>Meet Our Team</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="text-center">
                        <img src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                        alt="team member"
                        className='w-32 h-32 rounded-full mx-auto mb-4'
                        />

                        <h3 className='text-xl font-semibold text-gray-700'>Jennie Lannister</h3>
                        <p className='text-gray-500'>CEO</p>
                    </div>


                     <div className="text-center">
                        <img src="https://cdn-icons-png.flaticon.com/128/4140/4140037.png"
                        alt="team member"
                        className='w-32 h-32 rounded-full mx-auto mb-4'
                        />

                        <h3 className='text-xl font-semibold text-gray-700'>Carsie Lannister</h3>
                        <p className='text-gray-500'>CTO</p>
                    </div>


                     <div className="text-center">
                        <img src="https://cdn-icons-png.flaticon.com/128/6997/6997662.png"
                        alt="team member"
                        className='w-32 h-32 rounded-full mx-auto mb-4'
                        />

                        <h3 className='text-xl font-semibold text-gray-700'>Daenerys Targaryen</h3>
                        <p className='text-gray-500'>Lead Designer</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

