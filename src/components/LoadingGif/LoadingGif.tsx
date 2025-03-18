import React from "react";
import Image from "next/image";

const gifURLs = [
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnYwZGNmOWV6cjlobWtyMW1yZ294NWFia3RrM2QyMWM4MHdob3ltZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IgRhYAUmjSpLGwZIg3/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG55NHllZjBpNjNkb3EwYXNpeWE0aDRrNGZka3Q0aDFkemF5ZWF3NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HUpt2s9Pclgt9Vm/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnE4cXpwbDg3NHNnZHJvb3E4eWxqYjdxc3Nld2RxcjAzcGt4bnQzYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTka00xv2CNa6FzFaU/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnFpYXllbDhuMXJ0bGJ5cXdwODFmNDd3dTMzN3E4anh5bWU0NTBxOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3y0oCOkdKKRi0/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExajlocWcyeHNidG9mMDNuMDFocTJvMnh6MDk1aTJqbjlmNHJjd2ZzayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/motnLx3NDhfoSfuWXF/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnF6c2dmamZjdDk4MDIzcjA2aXc1bWRteXU1dTJqazJ5d2RzZG5tbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5HSYaZTcRpYnS/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd25qamlhNXU0ZTZkaTl1OHR3djB5Z3RybXgxYnh3d2JlcDJrN2Z2cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/chOyZePGEHDoTSY2CA/giphy.gif",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnlzbHY1cmgxdHVka205aGZxbmYzNXhva21ucmRvcGhiajd4bzdnbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9QBq5iaV6kB5m/giphy.gif",
];

export default function LoadingGif() {
  const URL = gifURLs[Math.floor(Math.random() * gifURLs.length)];
  return <Image src={URL} width={500} height={500} alt="loading gif" />;
}
