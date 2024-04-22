/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import _, { forEach, set } from "lodash";
import React, { useEffect, useState } from "react";

interface ContributionGraphProps {
  username?: string;
  accessToken?: string;
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({
  username,
  accessToken,
}) => {
  const [data, setData] = useState<any>(null);
  const [contributions, setContributions] = useState<any>(null);
  const [activeYear, setActiveYear] = useState<number>(
    new Date().getFullYear()
  );
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const apiUrl: string = "https://api.github.com/graphql";
    const query: string = `
      query {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((response: Response) => response.json())
      .then((data: any) => {
        const contributions: any =
          data.data.user.contributionsCollection.contributionCalendar;
        setData(contributions);
        filteredContributionsData(contributions, currentYear);
      })
      .catch((error: Error) => {
        console.error("Error fetching GitHub contributions:", error);
      });
  }, [accessToken, username]);

  const filteredContributionsData = (contributions: any, year: number) => {
    const filteredContributions = contributions.weeks
      .map((week: any) => {
        const filteredDays = week.contributionDays.filter((day: any) => {
          const dayYear = new Date(day.date).getFullYear();
          return dayYear === year;
        });
        const totalContributionCount = filteredDays.reduce(
          (acc: number, day: any) => {
            return acc + day.contributionCount;
          },
          0
        );

        return {
          contributionDays: filteredDays,
          totalContributionCount: totalContributionCount,
        };
      })
      .filter((week: any) => week.contributionDays.length > 0);

    const totalContributions = filteredContributions.reduce(
      (acc: number, week: any) => {
        return acc + week.totalContributionCount;
      },
      0
    );

    // console.log("Filtered Contributions", filteredContributions);
    // console.log("Total Contributions", totalContributions);
    setContributions({
      total: totalContributions,
      weeks: filteredContributions,
    });
  };

  const lastYear = 2023;
  const yearList = _.range(lastYear, currentYear + 1);

  console.log("Contributions", contributions);

  return (
    <div className="contribution-wrapper">
      {contributions?.total && (
        <div>
          <div className="table-auto">
            <h3>
              {" "}
              {contributions?.total} contributions in {activeYear}
            </h3>

            <div className="flex p-6 gap-4">
              {" "}
              <ul className="text-sm text-black flex flex-col gap-[2px] py-[2px]">
                {weekDays.map((day: string, index: number) => {
                  return <li key={index}>{day}</li>;
                })}
              </ul>
              <div className="flex ">
                {" "}
                {contributions?.weeks?.map((week: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-[2px] p-[2px] "
                    >
                      {/* months */}
                      <h1
                        className={`text-sm text-black font-bold text-center ${
                          monthNames[
                            new Date(week.contributionDays[0].date).getMonth()
                          ]
                        }`}
                      >
                        {
                          monthNames[
                            new Date(week.contributionDays[0].date).getMonth()
                          ]
                        }
                      </h1>

                      {week?.contributionDays?.map(
                        (day: any, index: number) => {
                          return (
                            <div
                              key={index}
                              className={`w-5 h-5 flex items-center justify-center text-center border border-gray-300 rounded-md `}
                              style={{
                                backgroundColor:
                                  day.contributionCount === 0
                                    ? "#b0b0b0"
                                    : day.contributionCount < 1
                                    ? "#5b705e"
                                    : day.contributionCount < 5
                                    ? "#457d4e"
                                    : day.contributionCount < 10
                                    ? "#349945"
                                    : day.contributionCount < 15
                                    ? "#19c235"
                                    : "#03ff2d",
                              }}
                            >
                              <p></p>
                            </div>
                          );
                        }
                      )}
                    </div>
                  );
                })}
              </div>
              <div className=" h-[18vh] overflow-y-auto pr-2 ">
                <ul className="text-sm  flex gap-[2px] py-[2px] flex-col-reverse">
                  {yearList?.map((year: number, index: number) => {
                    return (
                      <li
                        onClick={() => {
                          setActiveYear(year);
                          filteredContributionsData(data, year);
                        }}
                        className={
                          "px-3 cursor-pointer text-sm py-[2px]  rounded-lg " +
                          (year === activeYear ? "bg-gray-300" : "")
                        }
                        key={index}
                      >
                        {year}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionGraph;
