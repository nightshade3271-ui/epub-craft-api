/**
 * Sample Book Manuscript for EpubCraft API
 */
module.exports = {
  title: "The Art of Strategy",
  subtitle: "Principles of Leadership and Decisive Action",
  author: "Sun Tzu",
  publisher: "EpubCraft Classics",
  language: "en",
  theme: "theme-bookerly",
  paragraphStyle: "style-indented",
  coverPreset: "obsidian_gold",
  sections: [
    {
      title: "Dedication",
      type: "dedication",
      includeInToc: false,
      hasDropCap: false,
      content: "<p style=\"text-align: center; margin-top: 30vh; font-style: italic;\">Dedicated to those who build, seek clarity, and master the art of deliberate execution.</p>"
    },
    {
      title: "Laying Plans",
      chapterNumber: "Chapter I",
      type: "chapter",
      includeInToc: true,
      hasDropCap: true,
      content: `
        <p>The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.</p>
        <p>The moral law causes the people to be in complete accord with their ruler, so that they will follow him regardless of their lives, undismayed by any danger.</p>
        <p>Heaven signifies night and day, cold and heat, times and the seasons. Earth comprises distances, great and small; danger and security; open ground and narrow passes; the chances of life and death.</p>
        <div class="scene-break">✦ ✦ ✦</div>
        <p>The Commander stands for the virtues of wisdom, sincerely, benevolence, strictness, and courage. By method and discipline are to be understood the marshaling of the army in its proper subdivisions, the graduations of rank among the officers, the maintenance of roads by which supplies may reach the army, and the control of military expenditure.</p>
      `
    },
    {
      title: "Waging War",
      chapterNumber: "Chapter II",
      type: "chapter",
      includeInToc: true,
      hasDropCap: true,
      content: `
        <p>In the operations of war, where there are in the field a thousand swift chariots, as many heavy chariots, and a hundred thousand mail-clad soldiers, with provisions enough to carry them a thousand li, the expenditure at home and at the front, including entertainment of guests, small items such as glue and paint, and sums spent on chariots and armor, will reach the total of a thousand ounces of silver per day.</p>
        <p>When you engage in actual fighting, if victory is long in coming, then men's weapons will grow dull and their ardor will be damped. If you lay siege to a town, you will exhaust your strength.</p>
        <p>Again, if the campaign is protracted, the resources of the State will not be equal to the strain. Now, when your weapons are dulled, your ardor damped, your strength exhausted and your treasure spent, other chieftains will spring up to take advantage of your extremity. Then no man, however wise, will be able to avert the consequences that must ensue.</p>
      `
    },
    {
      title: "Attack by Stratagem",
      chapterNumber: "Chapter III",
      type: "chapter",
      includeInToc: true,
      hasDropCap: true,
      content: `
        <p>In the practical art of war, the best thing of all is to take the enemy's country whole and intact; to shatter and destroy it is not so good. So, too, it is better to recapture an army entire than to destroy it, to capture a regiment, a detachment or a company entire than to destroy them.</p>
        <p>Hence to fight and conquer in all your battles is not supreme excellence; supreme excellence consists in breaking the enemy's resistance without fighting.</p>
        <p>Thus the highest form of generalship is to balk the enemy's plans; the next best is to prevent the junction of the enemy's forces; the next in order is to attack the enemy's army in the field; and the worst policy of all is to besiege walled cities.</p>
      `
    }
  ]
};
