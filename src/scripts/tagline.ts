(() => {
  const taglines = [
    `The War of 1812 was fought by the United States and its allies against the United Kingdom and its allies in North America. It began when the United States declared war on Britain on 18 June 1812. Although peace terms were agreed upon in the December 1814 Treaty of Ghent, the war did not officially end until the peace treaty was ratified by the United States Congress on 17 February 1815.[11][12]
Anglo-American tensions stemmed from long-standing differences over territorial expansion in North America and British support for Tecumseh's confederacy, which resisted U.S. colonial settlement in the Old Northwest. In 1807, these tensions escalated after the Royal Navy began enforcing tighter restrictions on American trade with France and impressed sailors who were originally British subjects, even those who had acquired American citizenship.[13] Opinion in the U.S. was split on how to respond, and although majorities in both the House and Senate voted for war, they were divided along strict party lines, with the Democratic-Republican Party in favour and the Federalist Party against.[d][14] News of British concessions made in an attempt to avoid war did not reach the U.S. until late July, by which time the conflict was already underway.
At sea, the Royal Navy imposed an effective blockade on U.S. maritime trade, while between 1812 and 1814 British regulars and colonial militia defeated a series of American invasions on Upper Canada.[15] The April 1814 abdication of Napoleon allowed the British to send additional forces to North America and reinforce the Royal Navy blockade, crippling the American economy.[16] In August 1814, negotiations began in Ghent, with both sides wanting peace; the British economy had been severely impacted by the trade embargo, while the Federalists convened the Hartford Convention in December to formalize their opposition to the war
In August 1814, British troops captured Washington, before American victories at Baltimore and Plattsburgh in September ended fighting in the north. In the Southeastern United States, American forces and Indian allies defeated an anti-American faction of the Muscogee. In early 1815, American troops led by Andrew Jackson repulsed a major British attack on New Orleans, which occurred during the ratification process of the signing of the Treaty of Ghent, which brought an end to the conflict.[17] `,
    "I fear death for I am a sinner, and a dead man cannot repent.",
    "I dont become a better person, I just forget how awful I am.",
    "I love feet and armpits",
  ];
  const randomIndex = Math.floor(Math.random() * taglines.length);
  const tagline = document.getElementById("tagline") as HTMLSpanElement;
  tagline.innerHTML = ` | ${taglines[randomIndex]}`;
})();
