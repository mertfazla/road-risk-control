import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

function SideBar({ map }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageNum, setPageNum] = useState(1);
    const handleFetch = async () => {
        console.log(pageNum)
        console.log("Locations are fetching for images...");
        const res = await fetch(`http://localhost:8080/api/detects?page=${pageNum}`)
        const data = await res.json();

        const allData = [];
        for (const item of data) {
            const formattedAddress = await fetchAdress(item.lat, item.lng);
            allData.push({ ...item, formattedAddress });
        }
        setLoading(false);
        setData(prevData => [ ...prevData, ...allData ]);
    }
    const handleButton = (item) => {
        map.setCenter({ lat: parseFloat(item.lat), lng: parseFloat(item.lng) })
        map.setZoom(12);
    }
    const handlePageNum = ()=>{
        const updatedPageNum = pageNum + 1;
        setPageNum(updatedPageNum);
        setLoading(true);
    }
    useEffect(() => {
        if (loading || data.length === 0) {
            handleFetch()
        }
    }, [data, loading, pageNum])

    const fetchAdress = async (lat, lng) => {
        try{
            const get = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
            const res = await fetch(get);
            const adress = await res.json();
            const formattedAdress = adress.results[0].formatted_address
            return formattedAdress
        } catch(err){
            console.log(err)
            return null;
        }
    }
    return (
        <>
            <div>
                <ul className='absolute top-0 right-0 w-1/3 lg:w-1/4 xl:w-1/5 h-screen overflow-y-scroll z-50 bg-slate-50 shadow-xl'>
                    {data?.map((item) => {
                        const timestamp = item.timestamp
                        const date = new Date(timestamp)
                        const warningDate = date.toLocaleDateString('tr-TR')
                        const warningTime = date.toLocaleTimeString('tr-TR')
                        const warningTitle = (item.category == 1) ? 'Yuksek Risk' : 'Orta Risk'
                        const adress = item.formattedAddress
                        return (
                            <li key={item.id} className='flex flex-col border-black  '>
                                <div className='mb-3 py-3 px-3 bg-slate-100 shadow-xl'>
                                    <div className='text-red-700'>{warningTitle}</div>
                                    <div>
                                        <div className='flex gap-x-1 flex-row flex-wrap italic'>
                                            <div>{warningDate}</div>
                                            <div>{warningTime}</div>
                                        </div>
                                        <div>{adress}</div>
                                        
                                        <img src={item.image_url} alt="detected-frame" loading='lazy' width={480} height={360} />
                                    </div>
                                    <div className='bg-slate-200 flex justify-center rounded-md pb-1'>
                                        <button className=' underline text-green-700' onClick={() => handleButton(item)}  >Konuma Git</button>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                    <div className='w-full justify-center flex'><button className='bg-gray-100 px-2 py-1 rounded-lg' onClick={()=> handlePageNum()} >See More </button></div>
                </ul>
            </div>

        </>
    )
}

export default SideBar