/* ==========================================================================
   PAWVILLE — blog-data.js
   --------------------------------------------------------------------------
   Data for the dynamic blog detail page (blog-details.html?post=slug).
   Exposes window.PawBlogs — used by blog-details.js.
   Load BEFORE blog-details.js.
   ========================================================================== */
(function () {
  "use strict";

  var MAYA = { name: "Maya Torres", role: "Master Groomer", bio: "14 years grooming, 200+ breeds and a lifelong believer that kindness is the most important tool in any salon." };
  var OMAR = { name: "Omar Khaled", role: "Cat Care Specialist", bio: "PawVille's resident cat whisperer. Studied feline behaviour and spends his days making cats fall in love with grooming." };
  var SOFIA = { name: "Sofia Reyes", role: "Salon Manager", bio: "Runs the salon floor, trains new groomers and keeps everything running smooth — one paw at a time." };
  var NOAH = { name: "Noah Bennett", role: "Nutrition Consultant", bio: "Pet nutrition nerd who believes great coats start with great food — and a good groomer." };

  var POSTS = {
    "summer-coat": {
      title: "10 Grooming Tips for a Tangle-Free Summer Coat",
      category: "Grooming Tips",
      eyebrow: "Grooming",
      date: "Jun 12, 2026",
      readTime: "6 min read",
      comments: "14 comments",
      image: "assets/images/blog-card-1.jpg",
      alt: "Happy dog with a fresh summer groom",
      author: MAYA,
      excerpt: "Keep your dog cool and comfortable all season with these simple brushing and bathing habits.",
      tags: ["grooming", "summer", "coat care", "tips"],
      lead: "Summer means more outdoor fun — and more dirt, pollen, burrs and tangles. With a few smart habits, you can keep your dog's coat soft, tangle-free and healthy all season long.",
      body: [
        { h: "1. Brush before you bathe", p: "Always work out knots and mats <em>before</em> a bath. Water tightens tangles and makes mats nearly impossible to remove without scissors. A quick pre-brush makes bath time easier for both of you." },
        { h: "2. Choose the right brush for the coat", p: "Slicker brushes suit most double coats, pin brushes are great for long silky hair, and undercoat rakes do the heavy lifting during shedding season. Using the wrong brush can scratch skin or skip the undercoat entirely." },
        { q: "\"A five-minute brush three times a week beats a two-hour de-matting session every single time.\" — Maya Torres, Master Groomer" },
        { h: "3. Mind the mats behind the ears", p: "Behind the ears, under the collar and in the armpits are prime mat territory. Check these spots daily in summer — they hide moisture and can irritate skin fast." },
        { h: "4. Use a leave-in conditioner", p: "A light, pet-safe leave-in spray after drying adds slip and shine, and makes the next brush-out dramatically easier. Look for formulas without heavy fragrance or alcohol." },
        { h: "5. Don't shave double coats", p: "For breeds like huskies and golden retrievers, that fluffy undercoat actually insulates them from heat. Regular de-shedding keeps them cooler — shaving can ruin coat regrowth and increase sunburn risk." },
        { h: "6. Check for summer hitchhikers", p: "Brushes are also great tick and burr detectors. After every walk, a quick once-over through the coat catches unwelcome guests before they settle in." },
        { h: "7. Bathe with a schedule, not a habit", p: "Too many baths strip natural oils; too few leaves residue and itch. For most dogs, every 4–6 weeks is ideal — adjust for coat type and lifestyle." },
        { h: "8. Dry the undercoat thoroughly", p: "Moisture trapped against the skin is the #1 cause of summer skin issues. A good fluff-dry reaches what towels never will, and your groomer is a pro at this." },
        { h: "9. Trim the paw pads", p: "Long hair between the toes traps heat and grit. Keeping paw pads trimmed helps your dog stay comfortable and helps you keep the floors clean." },
        { h: "10. Book regular professional grooms", p: "Professional grooms catch what home care misses — skin checks, ear health, gland care and a proper finish. In summer, we recommend a groom every 4–6 weeks." }
      ]
    },

    "cat-brushing": {
      title: "Why Cats Actually Love a Good Brush (And How to Do It Right)",
      category: "Care & Health",
      eyebrow: "Cat Care",
      date: "Jun 05, 2026",
      readTime: "5 min read",
      comments: "9 comments",
      image: "assets/images/blog-card-2.jpg",
      alt: "Cat enjoying a gentle brush",
      author: OMAR,
      excerpt: "Bonding, fewer hairballs and a shinier coat — here's how to make brushing your cat's favorite ritual.",
      tags: ["cat care", "brushing", "grooming", "tips"],
      lead: "Most cats don't just tolerate a good brush — they adore it. Once you find the right tool and the right rhythm, brushing becomes five minutes of bonding your cat will ask for daily.",
      body: [
        { h: "1. Start where it feels good", p: "Begin at the cheeks, chin and the base of the ears — areas cats love. Move slowly down the neck and back, and stop before your cat ever shows signs of annoyance." },
        { h: "2. Pick the right brush", p: "A slicker brush suits medium to long coats, while short-hair cats often prefer a fine-toothed comb or a rubber brush that also collects loose fur." },
        { h: "3. Keep sessions short", p: "Two or three minutes of quality brushing beats a ten-minute wrestle. Daily mini-sessions keep the coat sleek and make shedding season a breeze." },
        { q: "\"A cat that chooses to stay during a brush is telling you you're doing it right.\" — Omar Khaled, Cat Care Specialist" },
        { h: "4. Turn it into a ritual", p: "Brush right before meals or treats, so your cat associates the brush with something good. A calm, consistent routine builds trust fast." },
        { h: "5. Watch for mats and skin", p: "While brushing, check for mats behind the ears, lumps, fleas or red skin. Early detection saves a stressful de-matting visit later." }
      ]
    },

    "nail-care": {
      title: "Nail Care 101: When to Trim and What to Watch For",
      category: "Care & Health",
      eyebrow: "Care & Health",
      date: "May 28, 2026",
      readTime: "4 min read",
      comments: "7 comments",
      image: "assets/images/blog-card-3.jpg",
      alt: "Close-up of a cat's paw with trimmed claws",
      author: SOFIA,
      excerpt: "Healthy nails protect paws and posture. Learn the signs it's time for a trim and the safest approach.",
      tags: ["nail care", "paws", "health", "tips"],
      lead: "Nails are the most commonly forgotten part of pet care — and one of the easiest to get wrong. Here's how to know when it's time and how we keep it stress-free.",
      body: [
        { h: "1. Listen for the click", p: "If you hear nails clicking on the floor, they're too long. Most dogs need a trim every 3–6 weeks; indoor cats often need one monthly." },
        { h: "2. Watch for posture changes", p: "Overlong nails push the paw into a splayed position and shift weight onto the wrists, which can lead to joint strain over time." },
        { h: "3. The quick is the limit", p: "The pink inner part of the nail (the quick) grows with the nail. On dark nails it's harder to see, which is why we trim conservatively and take our time." },
        { h: "4. Keep it positive", p: "We pair every nail with treats and praise, and stop before stress builds. Scared pets benefit from short, frequent sessions rather than one long battle." },
        { h: "5. Don't forget the dewclaws", p: "Dewclaws don't touch the ground, so they never wear down naturally. Left untrimmed, they can curl into the skin — a common and painful problem." }
      ]
    },

    "grain-free": {
      title: "Grain-Free Diets: Myths Every Pet Parent Should Know",
      category: "Nutrition",
      eyebrow: "Nutrition",
      date: "May 20, 2026",
      readTime: "5 min read",
      comments: "11 comments",
      image: "assets/images/blog-card-4.jpg",
      alt: "Bowl of balanced pet food",
      author: NOAH,
      excerpt: "Before you switch your pet's food, read what the evidence really says about grains, protein and coat health.",
      tags: ["nutrition", "grain-free", "diet", "health"],
      lead: "Grain-free has become a buzzword — but is it right for your pet? The honest answer: it depends. Here's what the evidence actually says.",
      body: [
        { h: "1. Grains aren't the enemy", p: "Most pets digest well-prepared grains just fine. Whole grains supply fibre, vitamins and energy. Allergies to grains are far rarer than allergies to proteins like chicken or beef." },
        { h: "2. When grain-free makes sense", p: "A true grain sensitivity, a veterinary recommendation, or simply a protein-forward diet that your pet thrives on are all valid reasons to go grain-free." },
        { h: "3. The DCM conversation", p: "Some grain-free foods heavy in legumes have been linked to canine dilated cardiomyopathy. Talk to your vet before choosing a legume-heavy formula." },
        { q: "\"A great coat is built at the food bowl — and maintained in the grooming chair.\" — Noah Bennett, Nutrition Consultant" },
        { h: "4. Read the ingredient list", p: "Look for a named animal protein as the first ingredient and a guaranteed analysis that fits your pet's life stage. 'Grain-free' alone tells you almost nothing." },
        { h: "5. Change diets slowly", p: "Whatever you choose, transition over 7–10 days, mixing increasing amounts of new food with the old, to avoid stomach upset." }
      ]
    },

    "mobile-van": {
      title: "Big News: The PawVille Mobile Grooming Van Is Here!",
      category: "Salon News",
      eyebrow: "News",
      date: "Jun 18, 2026",
      readTime: "3 min read",
      comments: "21 comments",
      image: "assets/images/blog-sidebar-1.jpg",
      alt: "PawVille mobile grooming van",
      author: SOFIA,
      excerpt: "We've launched our fully-equipped mobile unit — the full salon experience at your driveway.",
      tags: ["news", "mobile grooming", "salon", "announcement"],
      lead: "The waiting room is officially optional. Meet the PawVille mobile grooming van — a fully equipped salon that comes to you.",
      body: [
        { h: "1. Everything, on wheels", p: "Hydraulic grooming table, fresh water, professional dryers and our full range of pet-safe products — the van has everything you'd find at the salon, minus the car ride." },
        { h: "2. Calmer pets, happier homes", p: "No car sickness, no waiting room nerves and no barking chorus. Pets who struggle with travel settle in far faster at their own doorstep." },
        { h: "3. How to book", p: "The van is currently covering neighborhoods within 15 km of the salon, Wednesday through Saturday. Book it just like a salon appointment — pick 'Mobile Grooming' when you choose your service." },
        { h: "4. Same team, same care", p: "Our certified groomers run the van, and the same friendly check-in applies. It's the full PawVille experience — right in your driveway." }
      ]
    },

    "first-groom": {
      title: "A Parent's Guide to Your Puppy's Very First Groom",
      category: "Grooming Tips",
      eyebrow: "Puppy Care",
      date: "Jun 01, 2026",
      readTime: "7 min read",
      comments: "16 comments",
      image: "assets/images/blog-sidebar-2.jpg",
      alt: "Puppy during its first grooming session",
      author: MAYA,
      excerpt: "What to expect, how to prepare and why the first groom sets the tone for a lifetime of easy care.",
      tags: ["puppy", "first groom", "grooming", "tips"],
      lead: "A puppy's first groom shapes how they feel about being handled for the rest of their life. Get it right with a little preparation and a lot of patience.",
      body: [
        { h: "1. Start with handling at home", p: "Before the salon visit, get your puppy used to having their paws held, ears touched and fur combed. Short, treat-filled sessions work wonders." },
        { h: "2. Pick the right age", p: "We recommend a first professional groom between 10 and 14 weeks, once vaccinations are underway. It's more about exposure than a haircut." },
        { h: "3. Expect short and gentle", p: "First grooms are deliberately brief — a bath, gentle dry, a light tidy and lots of praise. We build up slowly so every visit stays easy." },
        { h: "4. Prepare for a nap", p: "A first groom is surprisingly tiring. Expect your puppy to sleep hard afterward — that's a sign they relaxed and felt safe." },
        { h: "5. Keep the cadence", p: "Come back every 4–6 weeks. Consistency is what turns a nervous first visit into a tail-wagging routine." }
      ]
    }
  };

  window.PawBlogs = POSTS;
})();
