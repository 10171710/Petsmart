/* ==========================================================================
   PAWVILLE — service-data.js
   --------------------------------------------------------------------------
   Data for the dynamic service detail page (service-details.html?service=slug).
   Exposes window.PawServices — used by service-details.js.
   ========================================================================== */
(function () {
  "use strict";

  var BOOK = "login.html?redirect=account/index.html";

  var SERVICES = {
    "bath-brush": {
      name: "Bath & Brush",
      icon: "🛁",
      image: "assets/images/svc-1.jpg",
      priceShort: "$25",
      bookLabel: "Book a Bath & Brush",
      bookHref: BOOK,
      heroSub: "A warm, gentle bath with pet-safe shampoo, thorough drying and a full brush-out to remove loose fur and tangles.",
      description: "The perfect reset for any coat. We start with a pre-bath de-tangle, wash with shampoo matched to your pet's coat and skin, condition, fluff-dry and finish with a full brush-out so your pet leaves clean, soft and smelling great.",
      includes: [
        { icon: "🛁", title: "Step 1 · Wash", text: "Pre-bath de-tangle and a warm wash with shampoo matched to your pet's coat." },
        { icon: "🌀", title: "Step 2 · Dry", text: "Gentle high-velocity and fluff drying to prevent matting and coat damage." },
        { icon: "✨", title: "Step 3 · Brush-out", text: "Full brush to remove loose fur, reduce shedding and spread natural oils." },
        { icon: "🌸", title: "Step 4 · Finish", text: "Light finishing spray and a coat check so they leave looking their best." }
      ],
      pricingTitle: "Bath & Brush pricing",
      pricingIntro: "Simple pricing — add de-shedding or a deep condition whenever your pet needs extra care.",
      pricingRows: [
        { name: "Bath & Brush", badge: "bg-teal", detail: "Any breed", duration: "~45 min", price: "$25" },
        { name: "With de-shedding", badge: "bg-amber", detail: "Double coats", duration: "~60 min", price: "$40" },
        { name: "Deep condition add-on", badge: "bg-violet", detail: "Dry or dull coats", duration: "+15 min", price: "+$12" }
      ],
      pricingNote: "Prices are starting points. Thick or heavily matted coats may need extra time — always confirmed with you in advance.",
      faqs: [
        { q: "How often should my pet get a bath?", a: "Most pets do well every 3–6 weeks. Bathing too often strips natural oils — we'll recommend a cadence for your pet's coat and lifestyle." },
        { q: "Which shampoo do you use?", a: "Only pet-safe, pH-balanced products. We pick from oatmeal, medicated, flea-control and hypoallergenic lines based on your pet's skin." },
        { q: "Is bathing included in a full groom?", a: "Yes — a bath and brush is always part of our full groom packages. Add spa upgrades like deep conditioning any time." },
        { q: "Do you offer drying only?", a: "For pets that are water-shy we can do dry-brush sessions, but most pets enjoy the warm bath once they're used to it." }
      ],
      related: ["haircut-styling", "spa-wellness", "full-groom"]
    },

    "haircut-styling": {
      name: "Haircut & Styling",
      icon: "✂️",
      image: "assets/images/svc-2.jpg",
      priceShort: "$40",
      bookLabel: "Book a Haircut & Styling",
      bookHref: BOOK,
      heroSub: "Breed-accurate or creative cuts shaped to your pet's coat and lifestyle — with a hand-finished look.",
      description: "Whether your pet needs a tidy breed-standard trim or a bold new look, our groomers shape the cut around your pet's coat type, comfort and routine. Every cut is hand-finished for a clean, natural silhouette.",
      includes: [
        { icon: "✂️", title: "Step 1 · Consultation", text: "We discuss your pet's breed standard, lifestyle and your preferred length and style." },
        { icon: "🪒", title: "Step 2 · Clipper work", text: "Careful clipper work for the body, belly and legs with safety guards for sensitive skin." },
        { icon: "🔍", title: "Step 3 · Detail scissoring", text: "Hand-scissored face, paws and tail for that crisp, finished look." },
        { icon: "✨", title: "Step 4 · Finishing", text: "Sanitary trim, coat spray and a final style check." }
      ],
      pricingTitle: "Haircut & Styling pricing",
      pricingIntro: "Priced by coat type and style — a breed haircut is the most popular choice.",
      pricingRows: [
        { name: "Breed haircut", badge: "bg-teal", detail: "Most breeds", duration: "~90 min", price: "$40" },
        { name: "Creative / show style", badge: "bg-amber", detail: "Custom request", duration: "~120 min", price: "$55" },
        { name: "Sanitary trim add-on", badge: "bg-violet", detail: "Belly, legs & pads", duration: "+15 min", price: "+$10" }
      ],
      pricingNote: "Prices are starting points for well-maintained coats. Matted coats may need extra time.",
      faqs: [
        { q: "What's the difference between a breed cut and a creative cut?", a: "A breed cut follows the official breed standard, like a poodle's classic clip. A creative cut is fully custom — patterns, colours or a style your pet loves." },
        { q: "Can you fix a badly grown-out coat?", a: "Yes. We may need to take the coat shorter to get back to a healthy base, then set a maintenance schedule so future cuts stay on track." },
        { q: "My pet hates the clippers — what do you do?", a: "We build trust slowly with treats and breaks, and use quieter tools where possible. Some pets prefer all-scissor styling and we'll adapt." },
        { q: "Do you cut cats too?", a: "Yes — cats get a separate, calm grooming room and a gentler, faster session. Certain cats may need a lion cut or sanitary shave." }
      ],
      related: ["full-groom", "bath-brush", "spa-wellness"]
    },

    "nail-trimming": {
      name: "Nail Trimming",
      icon: "💅",
      image: "assets/images/svc-3.jpg",
      priceShort: "$15",
      bookLabel: "Book a Nail Trim",
      bookHref: BOOK,
      heroSub: "Quick, careful trims with a dremel finish — and positive reinforcement so nails get easier every time.",
      description: "Short, healthy nails keep paws comfortable and floors scratch-free. We clip or grind carefully to avoid the quick, then tidy paw pads and finish with a dremel smooth so there are no sharp edges.",
      includes: [
        { icon: "✂️", title: "Step 1 · Clip", text: "Calm, careful clipping well above the quick for a comfortable cut." },
        { icon: "🌀", title: "Step 2 · Dremel finish", text: "A gentle grind smooths edges and rounds each nail." },
        { icon: "🐾️", title: "Step 3 · Paw-pad tidy", text: "Fur between the pads trimmed so nails sit naturally." },
        { icon: "🪵", title: "Step 4 · Dewclaw check", text: "Dewclaws checked and trimmed so they never curl into the skin." }
      ],
      pricingTitle: "Nail Trimming pricing",
      pricingIntro: "Fast and walk-in friendly — or add on to any groom.",
      pricingRows: [
        { name: "Nail trim (clip & grind)", badge: "bg-teal", detail: "All breeds", duration: "~15 min", price: "$15" },
        { name: "Full paw care", badge: "bg-amber", detail: "Nails + pads + dewclaws", duration: "~25 min", price: "$22" },
        { name: "Paw balm add-on", badge: "bg-violet", detail: "Soften & protect", duration: "—", price: "+$5" }
      ],
      pricingNote: "Black nails can make the quick hard to see — we trim conservatively and can do multiple short sessions if your pet is nervous.",
      faqs: [
        { q: "How often do nails need trimming?", a: "Most dogs every 3–6 weeks; indoor cats often need it monthly. If you hear clicking on the floor, they're due." },
        { q: "Do you use clippers or a grinder?", a: "A mix — clippers for the main cut and a dremel to smooth edges. If your pet dislikes one, we switch." },
        { q: "What if you cut the quick?", a: "We use quick-safe techniques and never rush. On the rare occasion bleeding happens, we stop, apply styptic powder and give treats." },
        { q: "Can nail trims help scared pets?", a: "Absolutely. We pair every nail with treats and praise, and stop before stress builds up so each visit gets easier." }
      ],
      related: ["ear-cleaning", "bath-brush", "full-groom"]
    },

    "ear-cleaning": {
      name: "Ear Cleaning",
      icon: "👂",
      image: "assets/images/svc-4.jpg",
      priceShort: "$12",
      bookLabel: "Book an Ear Clean",
      bookHref: BOOK,
      heroSub: "Gentle cleaning with vet-grade solution and a check for redness, odor or signs that need a vet's attention.",
      description: "Healthy ears mean fewer head shakes and less odour. We flush and wipe the ears with vet-grade solution, tidy excessive hair, and flag anything that looks like it needs a vet — all in a quick, low-stress visit.",
      includes: [
        { icon: "👀", title: "Step 1 · Check", text: "We look for redness, swelling, odour or discharge that may need a vet." },
        { icon: "💧", title: "Step 2 · Flush", text: "Vet-grade ear solution gently flushes wax and debris." },
        { icon: "🧻", title: "Step 3 · Wipe", text: "Outer ear wiped clean and dried carefully." },
        { icon: "✂️", title: "Step 4 · Tidy", text: "Excess ear hair trimmed so airflow improves." }
      ],
      pricingTitle: "Ear Cleaning pricing",
      pricingIntro: "Often bundled with baths and grooms — standalone visits are welcome too.",
      pricingRows: [
        { name: "Gentle ear clean", badge: "bg-teal", detail: "All breeds", duration: "~15 min", price: "$12" },
        { name: "With ear-hair tidy", badge: "bg-amber", detail: "Long / floppy ears", duration: "~20 min", price: "$16" },
        { name: "Ear care with bath", badge: "bg-violet", detail: "Add to any groom", duration: "+10 min", price: "+$8" }
      ],
      pricingNote: "If we spot signs of infection we'll pause and recommend a vet — we never treat medical conditions ourselves.",
      faqs: [
        { q: "How often should ears be cleaned?", a: "Every 4–8 weeks for most pets; floppy-eared breeds more often. Over-cleaning can irritate, so we keep it gentle." },
        { q: "My pet's ears smell bad — is that normal?", a: "A strong or yeasty smell can indicate infection. Book a vet check; we can clean safely around it but won't mask symptoms." },
        { q: "Do you pluck ear hair?", a: "We only remove hair when it traps wax or blocks airflow, and we do it gently." },
        { q: "Is ear cleaning safe for puppies?", a: "Yes — we use only pet-safe solution and a gentle technique suited to young ears." }
      ],
      related: ["nail-trimming", "bath-brush", "full-groom"]
    },

    "spa-wellness": {
      name: "Spa & Wellness",
      icon: "💆",
      image: "assets/images/svc-5.jpg",
      priceShort: "$30",
      bookLabel: "Book a Spa Session",
      bookHref: BOOK,
      heroSub: "Aromatherapy baths, mud masks, paw balm, teeth brushing and massage to soothe skin and soul.",
      description: "Turn a regular groom into a treat. Our spa menu adds aromatherapy, deep-conditioning masks, blueberry facials, teeth brushing and gentle massage — perfect for senior pets or anyone who deserves a little extra love.",
      includes: [
        { icon: "🧖", title: "Step 1 · Aromatherapy bath", text: "Calming scents and a warm wash tailored to skin sensitivity." },
        { icon: "🫐", title: "Step 2 · Mask & facial", text: "Deep-condition mask and a blueberry facial to brighten and soothe." },
        { icon: "🦷", title: "Step 3 · Dental care", text: "Gentle teeth brushing with pet-safe toothpaste." },
        { icon: "🪶", title: "Step 4 · Massage & balm", text: "Relaxing massage and paw balm for soft, protected pads." }
      ],
      pricingTitle: "Spa & Wellness pricing",
      pricingIntro: "Add-ons can be combined with any groom or booked as a stand-alone treat.",
      pricingRows: [
        { name: "Spa session", badge: "bg-teal", detail: "Bath + mask + massage", duration: "~30 min", price: "$30" },
        { name: "Blueberry facial", badge: "bg-amber", detail: "Face + ears + eyes", duration: "~20 min", price: "$15" },
        { name: "Teeth brushing", badge: "bg-violet", detail: "Add to any groom", duration: "+5 min", price: "+$8" }
      ],
      pricingNote: "Tell us about allergies or sensitivities before booking and we'll choose gentle, fragrance-free options.",
      faqs: [
        { q: "Is a spa day good for anxious pets?", a: "For many, yes — the slow pace, massage and calming scents help them relax. For highly anxious pets we keep sessions short and gradual." },
        { q: "What is a blueberry facial?", a: "A gentle, tinted facial mask that soothes tear stains and brightens the fur around the eyes — made with natural, safe ingredients." },
        { q: "Do senior pets benefit?", a: "Hugely. Gentle massage eases stiffness and spa baths are easier on sensitive skin. We adjust pressure and length for their comfort." },
        { q: "Can I add a spa to my regular groom?", a: "Anytime — just mention it at check-in and we'll bundle it in, with 15% off for club members." }
      ],
      related: ["full-groom", "bath-brush", "haircut-styling"]
    },

    "full-groom": {
      name: "Full Groom Packages",
      icon: "📦",
      image: "assets/images/svc-6.jpg",
      priceShort: "$29+",
      bookLabel: "Book a Full Groom",
      bookHref: BOOK,
      heroSub: "Everything your pet needs in a single visit — bath, haircut, nails, ears and a finishing touch — priced fairly by pet size.",
      description: "Our all-in-one service: bath, haircut, nails, ears and a show-ready finish, priced by pet size. Book a package and we'll tailor it to your pet's breed, coat and temperament during check-in.",
      includes: [
        { icon: "🛁", title: "Step 1 · Bath", text: "Pre-bath de-tangle, hypoallergenic wash, conditioning and a full fluff dry." },
        { icon: "✂️", title: "Step 2 · Cut & style", text: "Breed-accurate or custom haircut with hand-finishing and face details." },
        { icon: "💅", title: "Step 3 · Nails & pads", text: "Clip or grind nails, tidy paw pads and apply paw balm to keep them soft." },
        { icon: "✨", title: "Step 4 · Finishing", text: "Ear cleaning, gland check, teeth brush option and scented finishing spray." }
      ],
      pricingTitle: "Full Groom Package pricing by pet size",
      pricingIntro: "Every package includes bath, haircut, nails, ears and a finishing touch.",
      pricingRows: [
        { name: "Small Pals", badge: "bg-teal", detail: "Up to 9 kg", duration: "~75 min", price: "$29" },
        { name: "Medium Mates", badge: "bg-amber", detail: "9 – 20 kg", duration: "~120 min", price: "$49" },
        { name: "Large Legends", badge: "bg-violet", detail: "20 kg & up", duration: "~150 min", price: "$69" }
      ],
      pricingNote: "Prices are starting points. Thick, double or heavily matted coats may need extra time — always confirmed with you in advance.",
      faqs: [
        { q: "How often should my pet get a full groom?", a: "Most pets do well every 4–8 weeks depending on coat type. Curly and double coats need more frequent visits; short coats can stretch longer. We'll suggest a schedule during check-in." },
        { q: "Is it safe for puppies and kittens?", a: "Yes — we love first grooms. Puppies and kittens get shorter, gentler sessions, tons of treats, and a slow introduction to tools, water and sound so future visits stay easy." },
        { q: "What if my pet's coat is badly matted?", a: "We never shave aggressively without talking to you first. Depending on severity we'll quote a de-matting fee, or recommend the kindest option for your pet's comfort and skin health." },
        { q: "Can I add spa services to my package?", a: "Anytime. Add de-shedding, a mud mask, teeth brushing or a blueberry facial at check-out — club members get 15% off all add-ons." }
      ],
      related: ["bath-brush", "haircut-styling", "spa-wellness"]
    }
  };

  window.PawServices = SERVICES;
})();
