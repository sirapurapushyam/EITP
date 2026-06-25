export default function IdeaTimeline({ timeline }) {

  if (!timeline?.length) {

    return (

      <div className="text-slate-500">
        No activity found
      </div>

    );

  }

  return (

    <div className="space-y-6">

      {

        timeline.map(item => (

          <div
            key={item._id}
            className="relative flex gap-5"
          >

            {/* Timeline Dot */}
            <div className="flex flex-col items-center">

              <div
                className="
                  h-4
                  w-4
                  rounded-full
                  bg-blue-600
                  mt-1
                "
              />

              <div
                className="
                  flex-1
                  w-[2px]
                  bg-slate-200
                  mt-2
                "
              />

            </div>

            {/* Content */}
            <div
              className="
                flex-1
                rounded-3xl
                border
                border-slate-200
                bg-slate-50
                p-5
              "
            >

              <div className="
                flex
                flex-col
                gap-3
                md:flex-row
                md:items-center
                md:justify-between
              ">

                <h3 className="
                  text-lg
                  font-semibold
                  text-slate-800
                ">
                  {item.action}
                </h3>

                <div className="
                  text-xs
                  text-slate-400
                ">
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </div>

              </div>

              <div className="
                mt-3
                text-sm
                text-slate-500
              ">
                By {item.performedBy?.name}
              </div>

              {

                item.remarks && (

                  <div
                    className="
                      mt-4
                      rounded-2xl
                      bg-white
                      border
                      border-slate-200
                      p-4
                    "
                  >

                    <div className="
                      text-xs
                      uppercase
                      tracking-wide
                      text-slate-400
                      mb-2
                    ">
                      Remarks
                    </div>

                    <div className="
                      text-slate-700
                    ">
                      {item.remarks}
                    </div>

                  </div>

                )

              }

            </div>

          </div>

        ))

      }

    </div>

  );

}