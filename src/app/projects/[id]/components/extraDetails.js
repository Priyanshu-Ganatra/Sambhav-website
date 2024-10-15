import Image from "next/image";

export default function ExtraDetails({ moreProjectData }) {
    return (
        (moreProjectData && moreProjectData.length > 0 && (
            <div className="py-20 flex flex-col justify-center gap-20 items-center">
                {moreProjectData.map((data, index) => {
                    return (
                        <div key={data.id} className="max-page-width grid grid-cols-1 gap-10  justify-between items-center md:grid-cols-2">
                            {(index % 2 === 0) ? (
                                <>
                                    <div className={`order-${index % 2 + 2}`}>
                                        <h3 className="font-semibold text-xl">{data.title}</h3>
                                        <p className="text-justify" dangerouslySetInnerHTML={{ __html: data.description }} />
                                    </div>
                                    <div className={`relative flex items-center`}>
                                        <Image
                                            height={500}
                                            width={500}
                                            quality={100}
                                            src={data.imageUrl}
                                            className="object-contain className= w-full h-auto"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={`relative flex justify-center items-center`}>
                                        <Image
                                            height={500}
                                            width={500}
                                            quality={100}
                                            src={data.imageUrl}
                                            className="object-contain className= w-full h-auto"
                                        />
                                    </div>
                                    <div className={`order-${index % 2 + 2}`}>
                                        <h3 className="font-semibold text-xl">{data.title}</h3>
                                        <p className="text-justify" dangerouslySetInnerHTML={{ __html: data.description }} />
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>
        ))
    )
}

export const dynamic = 'force-dynamic'
export const revalidate = 0