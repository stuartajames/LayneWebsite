module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/favicon.ico (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/favicon.0x3dzn~oxb6tn.ico" + (globalThis["NEXT_CLIENT_ASSET_SUFFIX"] || ''));}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/app/favicon.ico (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 256,
    height: 256
};
}),
"[project]/lib/rmaToken.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRmaToken",
    ()=>getRmaToken
]);
let cachedToken = null;
async function getRmaToken() {
    if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
        return cachedToken.value;
    }
    const res = await fetch(process.env.RATEMYAGENT_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.RATEMYAGENT_CLIENT_ID,
            client_secret: process.env.RATEMYAGENT_CLIENT_SECRET,
            scope: 'read:agent-data'
        }),
        cache: 'no-store'
    });
    if (!res.ok) throw new Error(`RMA token request failed: ${res.status}`);
    const data = await res.json();
    cachedToken = {
        value: data.access_token,
        expiresAt: Date.now() + data.expires_in * 1000
    };
    return cachedToken.value;
}
}),
"[project]/lib/mockReviews.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_AGGREGATE",
    ()=>MOCK_AGGREGATE,
    "MOCK_REVIEWS",
    ()=>MOCK_REVIEWS
]);
const MOCK_AGGREGATE = {
    overallStars: 4.9,
    reviewCount: 76,
    profileUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
};
const MOCK_REVIEWS = [
    {
        id: 'mock-1',
        source: 'ratemyagent',
        author: 'Chrissy Bell',
        rating: 5,
        body: 'Layne was professional, reassuring and very friendly. She was truthful. I was totally at ease with her and trusted her. She delivered as promised so would definitely recommend her to family and friends. Thanks Layne',
        date: '2026-04-24',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    },
    {
        id: 'mock-2',
        source: 'ratemyagent',
        author: 'Seller',
        rating: 5,
        body: 'With her enthusiasm, positivity, sound advice, and attention for detail, Layne made selling our lovely home a smooth process with an outcome we are very happy with. We worked well together to create a plan that suited our circumstances, and it went as we had hoped for, selling within 5 weeks.\nLayne is a lovely and caring person, who easily connects with people. She was thorough in following up with interested parties and provided us with regular updates where things were at. As far as we can tell, Layne is very good at getting to know and supporting potential buyers. This resulted in a very quick negotiation process to finalise the sale after the tender. We can highly recommend Layne!',
        date: '2026-04-21',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    },
    {
        id: 'mock-3',
        source: 'ratemyagent',
        author: 'Michael Bell',
        rating: 5,
        body: 'Layne was great with sound advice and very helpful with making sure the house was ready to sell.',
        date: '2026-04-19',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    },
    {
        id: 'mock-4',
        source: 'ratemyagent',
        author: 'Alana Peek',
        rating: 5,
        body: 'Layne was so helpful and so lovely in guiding us through the auction process. She was so helpful at the open homes and made the whole process so easy!',
        date: '2026-04-19',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    },
    {
        id: 'mock-5',
        source: 'ratemyagent',
        author: 'Seller',
        rating: 4,
        body: 'As agent for the sale of my aunt\'s estate Layne and the Harcourts Khandallah team brought a thorough understanding of the local market, gave sound advice about how to prepare the property for sale and the method of sale (auction), conceived a unique marketing pitch (nearly 7000 views on TradeMe), and without fuss achieved an outstanding outcome in a challenging market.',
        date: '2026-03-15',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    },
    {
        id: 'mock-6',
        source: 'ratemyagent',
        author: 'Buyer',
        rating: 5,
        body: 'Layne was wonderful to work with. Her manner was very professional and she responded to my plethora of calls, texts, and e-mails quickly. Her genuine warmth and enthusiasm really shone through. Thank you for helping me find the house of my dreams, Layne!',
        date: '2026-03-08',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    },
    {
        id: 'mock-7',
        source: 'ratemyagent',
        author: 'Elizabeth Moloney-Geany',
        rating: 5,
        body: 'Layne was so helpful every step of the way and happy to help out with paperwork or staging - all the little things to make the process easier for us! Would highly recommend Layne to anyone considering selling. Thanks again!',
        date: '2026-03-07',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    },
    {
        id: 'mock-8',
        source: 'ratemyagent',
        author: 'Ben Burns',
        rating: 5,
        body: 'Layne was great to deal with. Punctual and nothing seemed to be an issue. She got the best result for all involved. Look forward to dealing with her next time.',
        date: '2026-03-02',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    },
    {
        id: 'mock-9',
        source: 'ratemyagent',
        author: 'Oskar Larsson',
        rating: 5,
        body: 'Very welcoming and knowledgeable at open homes and private viewing. Fast, clear communications throughout and great result!',
        date: '2026-02-23',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    },
    {
        id: 'mock-10',
        source: 'ratemyagent',
        author: 'Hadleigh Pedler',
        rating: 5,
        body: 'We were very impressed by Layne\'s professionalism, responsiveness, enthusiasm, hard work and flair. She put in a lot of work to market and promote our home, above and beyond what we expected. Layne was always quick to respond and pass on information, gave us good advice and was always friendly and easy to deal with. The end result was a good outcome for us.',
        date: '2026-02-22',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    },
    {
        id: 'mock-11',
        source: 'ratemyagent',
        author: 'Henry Popplewell',
        rating: 5,
        body: 'Layne impressed from day one with her clear, upfront and positive approach to engaging with us.\n\nLayne is a passionate and talented marketer of a property. Providing careful thought, local knowledge and unique and impactful execution to the campaign. And she kept us informed every step of the way, achieving an outcome and interest beyond what I had hoped and expected.\n\nI would 100% recommend Layne to anyone looking to sell their home.',
        date: '2026-02-22',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    },
    {
        id: 'mock-12',
        source: 'ratemyagent',
        author: 'Josh',
        rating: 5,
        body: "I couldn't have asked for a better real estate agent. Layne went above and beyond at every step. Despite things being a bit challenging with my relocation to Auckland, she was always available when needed and guided me through the entire process, answering all of my questions along the way. She took the stress out of everything and made the experience seamless. The property sold far quicker than I expected. It was a pleasure meeting and working with her, and I would happily use her again if I own property in Wellington.",
        date: '2026-01-19',
        isRecommended: true,
        reviewUrl: 'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview'
    }
];
}),
"[project]/lib/reviews.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getReviewAggregate",
    ()=>getReviewAggregate,
    "getReviews",
    ()=>getReviews
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rmaToken$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rmaToken.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mockReviews$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mockReviews.ts [app-rsc] (ecmascript)");
;
;
const AGENT_CODE = process.env.LAYNE_AGENT_CODE;
const API_BASE = process.env.RATEMYAGENT_API_URL ?? 'https://developers.ratemyagent.co.nz';
async function getReviewAggregate() {
    if (!process.env.RATEMYAGENT_CLIENT_ID) return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mockReviews$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MOCK_AGGREGATE"];
    try {
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rmaToken$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRmaToken"])();
        const res = await fetch(`${API_BASE}/agent/${AGENT_CODE}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            next: {
                revalidate: 21600
            }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return {
            overallStars: data.OverallStars,
            reviewCount: data.ReviewCount,
            profileUrl: data.RmaAgentProfileUrl
        };
    } catch  {
        return null;
    }
}
async function getReviews(skip = 0, take = 6) {
    if (!process.env.RATEMYAGENT_CLIENT_ID) {
        const page = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mockReviews$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MOCK_REVIEWS"].slice(skip, skip + take);
        return {
            reviews: page,
            total: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mockReviews$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MOCK_REVIEWS"].length
        };
    }
    try {
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rmaToken$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRmaToken"])();
        const url = new URL(`${API_BASE}/agent/${AGENT_CODE}/sales/reviews`);
        url.searchParams.set('skip', String(skip));
        url.searchParams.set('take', String(take));
        const res = await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${token}`
            },
            next: {
                revalidate: 21600
            }
        });
        if (!res.ok) return null;
        const data = await res.json();
        const reviews = (data.Results ?? []).map((r)=>({
                id: r.ReviewCode?.Code ?? String(r.ReviewCode?.Number ?? ''),
                source: 'ratemyagent',
                author: r.ReviewerName ?? 'Anonymous',
                rating: r.StarRating ?? 0,
                body: r.Description ?? '',
                date: r.ReviewedOn.split('T')[0],
                isRecommended: r.IsRecommended,
                reviewUrl: r.ReviewUrl ?? undefined
            }));
        return {
            reviews,
            total: data.Total
        };
    } catch  {
        return null;
    }
}
}),
"[project]/lib/mockData.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_LISTINGS",
    ()=>MOCK_LISTINGS,
    "MOCK_SUBURB_STATS",
    ()=>MOCK_SUBURB_STATS
]);
const MOCK_LISTINGS = [
    {
        id: 'mock-listing-1',
        slug: '42-broderick-road-johnsonville',
        address: {
            street: '42 Broderick Road',
            suburb: 'Johnsonville',
            city: 'Wellington',
            postcode: '6037'
        },
        status: 'for-sale',
        price: 795000,
        priceDisplay: 'Offers over $795,000',
        bedrooms: 3,
        bathrooms: 2,
        carSpaces: 1,
        images: [],
        description: 'A warm and inviting family home positioned in one of Johnsonville\'s most sought-after streets. Featuring generous living spaces across two levels, a sunny north-facing deck, and a low-maintenance garden — this property is perfect for growing families or investors. Walking distance to Johnsonville train station and local schools.',
        inspections: [
            {
                date: '2026-05-03',
                time: '11:00–11:30am'
            },
            {
                date: '2026-05-10',
                time: '11:00–11:30am'
            }
        ],
        listedAt: '2026-04-20'
    },
    {
        id: 'mock-listing-2',
        slug: '15-awarua-street-ngaio',
        address: {
            street: '15 Awarua Street',
            suburb: 'Ngaio',
            city: 'Wellington',
            postcode: '6035'
        },
        status: 'sold',
        price: 985000,
        priceDisplay: 'Sold $985,000',
        bedrooms: 4,
        bathrooms: 2,
        carSpaces: 2,
        images: [],
        description: 'A beautifully presented character home blending original features with modern updates. Set on a well-established section with stunning bush views, double garaging, and an easy flow to a private outdoor entertaining area. Sold by tender within three weeks.',
        inspections: [],
        listedAt: '2026-03-01',
        soldAt: '2026-03-22'
    },
    {
        id: 'mock-listing-3',
        slug: '8-khandallah-road-khandallah',
        address: {
            street: '8 Khandallah Road',
            suburb: 'Khandallah',
            city: 'Wellington',
            postcode: '6035'
        },
        status: 'sold',
        price: 850000,
        priceDisplay: 'Sold $850,000',
        bedrooms: 3,
        bathrooms: 1,
        carSpaces: 1,
        images: [],
        description: 'A classic Khandallah villa with high ceilings, native timber floors, and a sun-drenched garden. Renovated kitchen and bathroom, with a separate laundry and off-street parking. Achieved $45,000 above the CV in a competitive multi-offer situation.',
        inspections: [],
        listedAt: '2026-02-10',
        soldAt: '2026-03-01'
    }
];
const MOCK_SUBURB_STATS = [
    {
        suburb: 'Broadmeadows',
        medianSalePrice: 710000,
        medianDaysOnMarket: 38,
        salesVolume: 8,
        yearOnYearChange: -2.1,
        updatedAt: '2026-03-31'
    },
    {
        suburb: 'Churton Park',
        medianSalePrice: 825000,
        medianDaysOnMarket: 32,
        salesVolume: 18,
        yearOnYearChange: 1.4,
        updatedAt: '2026-03-31'
    },
    {
        suburb: 'Glenside',
        medianSalePrice: 760000,
        medianDaysOnMarket: 35,
        salesVolume: 6,
        yearOnYearChange: -0.8,
        updatedAt: '2026-03-31'
    },
    {
        suburb: 'Grenada North',
        medianSalePrice: 745000,
        medianDaysOnMarket: 40,
        salesVolume: 10,
        yearOnYearChange: 0.5,
        updatedAt: '2026-03-31'
    },
    {
        suburb: 'Grenada Village',
        medianSalePrice: 720000,
        medianDaysOnMarket: 42,
        salesVolume: 7,
        yearOnYearChange: -1.2,
        updatedAt: '2026-03-31'
    },
    {
        suburb: 'Johnsonville',
        medianSalePrice: 780000,
        medianDaysOnMarket: 30,
        salesVolume: 24,
        yearOnYearChange: 2.3,
        updatedAt: '2026-03-31'
    },
    {
        suburb: 'Khandallah',
        medianSalePrice: 920000,
        medianDaysOnMarket: 28,
        salesVolume: 14,
        yearOnYearChange: 3.1,
        updatedAt: '2026-03-31'
    },
    {
        suburb: 'Newlands',
        medianSalePrice: 755000,
        medianDaysOnMarket: 34,
        salesVolume: 20,
        yearOnYearChange: 0.9,
        updatedAt: '2026-03-31'
    },
    {
        suburb: 'Ngaio',
        medianSalePrice: 895000,
        medianDaysOnMarket: 29,
        salesVolume: 12,
        yearOnYearChange: 2.7,
        updatedAt: '2026-03-31'
    },
    {
        suburb: 'Raroa',
        medianSalePrice: 870000,
        medianDaysOnMarket: 31,
        salesVolume: 9,
        yearOnYearChange: 1.8,
        updatedAt: '2026-03-31'
    },
    {
        suburb: 'Tawa',
        medianSalePrice: 720000,
        medianDaysOnMarket: 36,
        salesVolume: 28,
        yearOnYearChange: -0.4,
        updatedAt: '2026-03-31'
    },
    {
        suburb: 'Wadestown',
        medianSalePrice: 1050000,
        medianDaysOnMarket: 26,
        salesVolume: 8,
        yearOnYearChange: 4.2,
        updatedAt: '2026-03-31'
    }
];
}),
"[project]/components/shared/StarRating.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StarRating",
    ()=>StarRating
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
const GOLD = '#c9a84c';
const EMPTY = '#e5e7eb';
function StarRating({ rating, max = 5, size = 'md' }) {
    const px = size === 'sm' ? 12 : size === 'lg' ? 24 : 16;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-0.5",
        "aria-label": `${rating} out of ${max} stars`,
        role: "img",
        children: Array.from({
            length: max
        }, (_, i)=>{
            const fillPct = Math.round(Math.min(1, Math.max(0, rating - i)) * 100);
            const gradId = `sg-${i}-${fillPct}`;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: px,
                height: px,
                viewBox: "0 0 20 20",
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: gradId,
                            x1: "0",
                            x2: "1",
                            y1: "0",
                            y2: "0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: `${fillPct}%`,
                                    stopColor: GOLD
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/StarRating.tsx",
                                    lineNumber: 34,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: `${fillPct}%`,
                                    stopColor: EMPTY
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/StarRating.tsx",
                                    lineNumber: 35,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/StarRating.tsx",
                            lineNumber: 33,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/shared/StarRating.tsx",
                        lineNumber: 32,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z",
                        fill: `url(#${gradId})`
                    }, void 0, false, {
                        fileName: "[project]/components/shared/StarRating.tsx",
                        lineNumber: 38,
                        columnNumber: 13
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/components/shared/StarRating.tsx",
                lineNumber: 25,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/shared/StarRating.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/reviews/ReviewSummaryBar.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReviewSummaryBar",
    ()=>ReviewSummaryBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$StarRating$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/StarRating.tsx [app-rsc] (ecmascript)");
;
;
function ReviewSummaryBar({ aggregate }) {
    if (!aggregate) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-4 rounded-lg bg-white px-6 py-4 shadow-sm ring-1 ring-black/5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$StarRating$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StarRating"], {
                rating: aggregate.overallStars,
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/components/reviews/ReviewSummaryBar.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-baseline gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-2xl font-bold text-brand-dark",
                        children: aggregate.overallStars.toFixed(1)
                    }, void 0, false, {
                        fileName: "[project]/components/reviews/ReviewSummaryBar.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-gray-500",
                        children: "/ 5"
                    }, void 0, false, {
                        fileName: "[project]/components/reviews/ReviewSummaryBar.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/reviews/ReviewSummaryBar.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-5 w-px bg-gray-200",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/components/reviews/ReviewSummaryBar.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-gray-600",
                children: [
                    aggregate.reviewCount.toLocaleString(),
                    " reviews"
                ]
            }, void 0, true, {
                fileName: "[project]/components/reviews/ReviewSummaryBar.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: aggregate.profileUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "ml-auto text-sm font-medium text-brand-gold hover:text-brand-gold-dark transition-colors",
                children: "View on RateMyAgent →"
            }, void 0, false, {
                fileName: "[project]/components/reviews/ReviewSummaryBar.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/reviews/ReviewSummaryBar.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/listings/ListingCard.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ListingCard",
    ()=>ListingCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
;
;
const STATUS_STYLES = {
    'for-sale': 'bg-brand-gold text-white',
    'sold': 'bg-gray-700 text-white',
    'for-rent': 'bg-blue-600 text-white',
    'leased': 'bg-gray-500 text-white'
};
const STATUS_LABELS = {
    'for-sale': 'For Sale',
    'sold': 'Sold',
    'for-rent': 'For Rent',
    'leased': 'Leased'
};
function ListingCard({ listing }) {
    const { address, status, priceDisplay, bedrooms, bathrooms, carSpaces, slug } = listing;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        href: `/listings/${slug}`,
        className: "group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md hover:ring-brand-gold/30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inset-0 flex items-center justify-center text-xs text-gray-400",
                        children: "Photo coming soon"
                    }, void 0, false, {
                        fileName: "[project]/components/listings/ListingCard.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`,
                        children: STATUS_LABELS[status]
                    }, void 0, false, {
                        fileName: "[project]/components/listings/ListingCard.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/listings/ListingCard.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 flex-col gap-1 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-semibold text-brand-dark group-hover:text-brand-gold transition-colors",
                        children: address.street
                    }, void 0, false, {
                        fileName: "[project]/components/listings/ListingCard.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500",
                        children: [
                            address.suburb,
                            ", ",
                            address.city
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/listings/ListingCard.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm font-medium text-gray-700",
                        children: priceDisplay
                    }, void 0, false, {
                        fileName: "[project]/components/listings/ListingCard.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex items-center gap-4 text-xs text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    bedrooms,
                                    " bed"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/listings/ListingCard.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    bathrooms,
                                    " bath"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/listings/ListingCard.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            carSpaces > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    carSpaces,
                                    " car"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/listings/ListingCard.tsx",
                                lineNumber: 50,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/listings/ListingCard.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/listings/ListingCard.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/listings/ListingCard.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/market/MarketInsightsStrip.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarketInsightsStrip",
    ()=>MarketInsightsStrip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
;
;
function formatPrice(n) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}m`;
    return `$${(n / 1000).toFixed(0)}k`;
}
function MarketInsightsStrip({ stats }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-baseline justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-brand-dark",
                        children: "Market Insights"
                    }, void 0, false, {
                        fileName: "[project]/components/market/MarketInsightsStrip.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: "/market-insights",
                        className: "text-sm font-medium text-brand-gold hover:text-brand-gold-dark transition-colors",
                        children: "All suburbs →"
                    }, void 0, false, {
                        fileName: "[project]/components/market/MarketInsightsStrip.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/market/MarketInsightsStrip.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
                children: stats.map((stat)=>{
                    const changePositive = stat.yearOnYearChange >= 0;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex shrink-0 flex-col gap-1 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 w-44",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-semibold text-brand-dark",
                                children: stat.suburb
                            }, void 0, false, {
                                fileName: "[project]/components/market/MarketInsightsStrip.tsx",
                                lineNumber: 31,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-lg font-bold text-brand-dark",
                                children: formatPrice(stat.medianSalePrice)
                            }, void 0, false, {
                                fileName: "[project]/components/market/MarketInsightsStrip.tsx",
                                lineNumber: 32,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xs font-medium ${changePositive ? 'text-green-600' : 'text-red-600'}`,
                                children: [
                                    changePositive ? '+' : '',
                                    stat.yearOnYearChange.toFixed(1),
                                    "% YoY"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/market/MarketInsightsStrip.tsx",
                                lineNumber: 35,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400",
                                children: [
                                    stat.medianDaysOnMarket,
                                    " days avg"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/market/MarketInsightsStrip.tsx",
                                lineNumber: 42,
                                columnNumber: 15
                            }, this)
                        ]
                    }, stat.suburb, true, {
                        fileName: "[project]/components/market/MarketInsightsStrip.tsx",
                        lineNumber: 27,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/market/MarketInsightsStrip.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/market/MarketInsightsStrip.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviews$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/reviews.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mockData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mockData.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$reviews$2f$ReviewSummaryBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/reviews/ReviewSummaryBar.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$listings$2f$ListingCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/listings/ListingCard.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$market$2f$MarketInsightsStrip$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/market/MarketInsightsStrip.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
const revalidate = 21600;
async function Home() {
    const aggregate = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviews$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReviewAggregate"])();
    const featuredListings = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mockData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MOCK_LISTINGS"].slice(0, 3);
    const stripStats = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mockData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MOCK_SUBURB_STATS"].slice(0, 6);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-brand-dark text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-1 flex-col gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold uppercase tracking-widest text-brand-gold",
                                    children: "Harcourts Wellington City"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 22,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-4xl font-bold leading-tight sm:text-5xl",
                                    children: "Wellington's Northern Suburbs Specialist"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 25,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "max-w-lg text-lg leading-relaxed text-gray-300",
                                    children: "Helping families buy and sell in Khandallah, Ngaio, Johnsonville, Tawa and the surrounding suburbs — with local knowledge, honest advice, and a 4.9★ track record."
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 28,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/contact",
                                            className: "rounded-full bg-brand-gold px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-gold-dark",
                                            children: "Contact Layne"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 34,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/listings",
                                            className: "rounded-full border border-white/30 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10",
                                            children: "View listings"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 40,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-shrink-0 lg:w-80",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative aspect-[3/4] overflow-hidden rounded-2xl",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/layne-hero.jpg",
                                    alt: "Layne Hughes — Harcourts Wellington City",
                                    fill: true,
                                    className: "object-cover",
                                    sizes: "(max-width: 1024px) 100vw, 320px",
                                    priority: true
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 51,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            aggregate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-white border-b border-gray-100",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$reviews$2f$ReviewSummaryBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReviewSummaryBar"], {
                        aggregate: aggregate
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 68,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 67,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6 flex items-baseline justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-brand-dark",
                                children: "Current Listings"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: "/listings",
                                className: "text-sm font-medium text-brand-gold hover:text-brand-gold-dark transition-colors",
                                children: "All listings →"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                        children: featuredListings.map((listing)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$listings$2f$ListingCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ListingCard"], {
                                listing: listing
                            }, listing.id, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-brand-bg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$market$2f$MarketInsightsStrip$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MarketInsightsStrip"], {
                        stats: stripStats
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-brand-gold",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 lg:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white sm:text-3xl",
                            children: "Thinking of buying or selling?"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mx-auto mt-3 max-w-lg text-white/90",
                            children: "Get a free, no-obligation appraisal of your property from a specialist who knows your neighbourhood."
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: "/contact",
                            className: "mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-brand-gold transition-colors hover:bg-brand-bg",
                            children: "Book a free appraisal"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0~3c1hu._.js.map