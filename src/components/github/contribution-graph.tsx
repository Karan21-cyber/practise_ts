"use client";
import React, { useEffect } from "react";

interface GithubContributionsProps {
  username: string;
  accessToken: string;
}

const GithubContributions: React.FC<GithubContributionsProps> = ({
  username,
  accessToken,
}) => {
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
        const weeks: any[] = contributions.weeks;

        console.log("GitHub contributions data:", contributions);

        // Create the table structure based on contributions data
        const contributionTable: HTMLElement | null =
          document.getElementById("contribution-table");
        if (contributionTable) {
          for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            const row: HTMLTableRowElement = document.createElement("tr");
            for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
              const week: any = weeks[weekIndex];
              const contributionDay: any = week.contributionDays[dayOfWeek];
              const contributionCount: number = contributionDay
                ? contributionDay.contributionCount
                : 0;
              const td = document.createElement("td");
              const th = document.createElement("th");

              let contributionColor: string;
              // setting the collor on the basis of contribution count
              if (contributionCount < 1) {
                contributionColor = "#3b5c40";
              } else if (contributionCount < 5) {
                contributionColor = "#3c6e45";
              } else if (contributionCount < 10) {
                contributionColor = "#3b8a48";
              } else if (contributionCount < 15) {
                contributionColor = "#3aab4d";
              } else {
                contributionColor = "#11ed35";
              }
              td.className = `w-5 h-5 p-1 border border-gray-300 rounded-md text-[${contributionColor}]`;
              row.appendChild(td);
            }
            contributionTable.appendChild(row);
          }
        }
      })
      .catch((error: Error) => {
        console.error("Error fetching GitHub contributions:", error);
      });
  }, [accessToken, username]);

  return <table id="contribution-table"></table>;
};

export default GithubContributions;
