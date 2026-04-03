// lib/echo.js
import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echo = null;

if (typeof window !== "undefined") {
  window.Pusher = Pusher;

  echo = new Echo({
    broadcaster: "pusher",
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    forceTLS: true,
  });
}

export { echo };