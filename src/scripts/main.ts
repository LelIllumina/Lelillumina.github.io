import fetchNekostats from "./nekostats";
(async () => {
  try {
    const json = await fetchNekostats("lel");

    const updated = new Date(json.updated_at).toLocaleDateString(); // Formats Last Updated text
    const created = new Date(json.created_at).toLocaleDateString(); // Formats Creation Date text
    (document.getElementById("created") as HTMLParagraphElement).innerHTML =
      `<em>Created</em>: <time datetime="${created}">${created}</time>`;
    (document.getElementById("updated") as HTMLParagraphElement).innerHTML =
      `<em>Updated</em>: <time datetime="${updated}">${updated}</time>`;
    // document.getElementById("visitors").innerHTML =
    //   `<em>Visits</em>: ${json.views}`;
    (document.getElementById("followers") as HTMLParagraphElement).innerHTML =
      `<em>Followers</em>: ${json.followers}`;

    const container = document.getElementById(
      "views-counter",
    ) as HTMLDivElement;
    const digits = json.views.toString().split(""); // Split the number into individual digits
    container.innerHTML = ""; // Clear previous content

    for (let i = 0; i < digits.length; i++) {
      const digit = digits[i];

      const img = document.createElement("img");
      img.src = `/images/numbers/${digit}.gif`; // Adjust path to your digit images
      img.alt = digit;
      img.height = 100;
      img.width = 45;

      container.appendChild(img);
    }
  } catch (error: unknown) {
    console.error(error);

    const container = document.getElementById(
      "views-counter",
    ) as HTMLDivElement;
    const subtitle = document.getElementById("subtitle") as HTMLDivElement;

    subtitle.innerHTML = "Script failed Noooooo";
    container.innerHTML = "";

    let status = "Unknown";
    if (error instanceof Error) {
      if (error.message.startsWith("HTTP Error:")) {
        status = error.message.split(": ")[1];
      }
    } else {
      // Handle the case where error is not an instance of Error
      console.error("Unknown error", error);
    }

    const numbers = status.split("");

    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];

      const img = document.createElement("img");
      img.src = `/images/numbers/${num}.gif`;
      img.alt = num;
      img.height = 100;
      img.width = 45;

      container.appendChild(img);
    }
  }
})();
