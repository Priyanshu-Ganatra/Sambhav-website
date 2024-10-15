export default function Amenities({ amenities }) {
    // Check if amenities exists and is not empty
    if (!amenities || amenities.length === 0) {
        return <></>; 
    }

    console.log(amenities)

    return (
        <div className="bg-slate-200 p-5 mb-5 flex flex-col items-center justify-center">
            <div className="page-section flex justify-center items-center">
                {amenities.map((data, index) => {
                    return (
                        <div className="min-w-[40px] aspect-square overflow-x-auto flex items-center" key={index}>
                            {data.amenity}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
