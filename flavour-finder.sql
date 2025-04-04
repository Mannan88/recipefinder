--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

-- Started on 2025-04-01 02:15:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16581)
-- Name: recipeIngrediants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."recipeIngrediants" (
    id integer NOT NULL,
    ingrediant text
);


ALTER TABLE public."recipeIngrediants" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16580)
-- Name: recipeingrediants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recipeingrediants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recipeingrediants_id_seq OWNER TO postgres;

--
-- TOC entry 3335 (class 0 OID 0)
-- Dependencies: 216
-- Name: recipeingrediants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recipeingrediants_id_seq OWNED BY public."recipeIngrediants".id;


--
-- TOC entry 215 (class 1259 OID 16570)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16569)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3336 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3179 (class 2604 OID 16584)
-- Name: recipeIngrediants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."recipeIngrediants" ALTER COLUMN id SET DEFAULT nextval('public.recipeingrediants_id_seq'::regclass);


--
-- TOC entry 3178 (class 2604 OID 16573)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3329 (class 0 OID 16581)
-- Dependencies: 217
-- Data for Name: recipeIngrediants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."recipeIngrediants" (id, ingrediant) FROM stdin;
1	Chicken
2	Salmon
3	Beef
4	Pork
5	Avocado
9	Apple Cider Vinegar
10	Asparagus
11	Aubergine
13	Baby Plum Tomatoes
14	Bacon
15	Baking Powder
16	Balsamic Vinegar
17	Basil
18	Basil Leaves
19	Basmati Rice
20	Bay Leaf
21	Bay Leaves
23	Beef Brisket
24	Beef Fillet
25	Beef Gravy
26	Beef Stock
27	Bicarbonate Of Soda
28	Biryani Masala
29	Black Pepper
30	Black Treacle
31	Borlotti Beans
32	Bowtie Pasta
33	Bramley Apples
34	Brandy
35	Bread
36	Breadcrumbs
37	Broccoli
38	Brown Lentils
39	Brown Rice
40	Brown Sugar
41	Butter
43	Cacao
44	Cajun
45	Canned Tomatoes
46	Cannellini Beans
47	Cardamom
49	Carrots
50	Cashew Nuts
51	Cashews
52	Caster Sugar
53	Cayenne Pepper
54	Celeriac
55	Celery
56	Celery Salt
57	Challots
58	Charlotte Potatoes
59	Cheddar Cheese
60	Cheese
61	Cheese Curds
62	Cherry Tomatoes
63	Chestnut Mushroom
65	Chicken Breast
66	Chicken Breasts
67	Chicken Legs
68	Chicken Stock
70	Chicken Thighs
71	Chickpeas
72	Chili Powder
73	Chilled Butter
74	Chilli
75	Chilli Powder
76	Chinese Broccoli
77	Chocolate Chips
78	Chopped Onion
79	Chopped Parsley
80	Chopped Tomatoes
81	Chorizo
82	Christmas Pudding
83	Cilantro
84	Cinnamon
85	Cinnamon Stick
87	Cloves
88	Coco Sugar
89	Cocoa
90	Coconut Cream
91	Coconut Milk
92	Colby Jack Cheese
93	Cold Water
94	Condensed Milk
95	Coriander
96	Coriander Leaves
97	Coriander Seeds
98	Corn Tortillas
99	Cornstarch
100	Cream
101	Creme Fraiche
102	Cubed Feta Cheese
103	Cucumber
104	Cumin
105	Cumin Seeds
106	Curry Powder
107	Dark Brown Sugar
108	Dark Soft Brown Sugar
109	Dark Soy Sauce
110	Demerara Sugar
111	Diced Tomatoes
112	Digestive Biscuits
113	Dill
114	Doner Meat
115	Double Cream
116	Dried Oregano
117	Dry White Wine
119	Egg Plants
120	Egg Rolls
121	Egg White
122	Egg Yolks
123	Eggs
124	Enchilada Sauce
125	English Mustard
126	Extra Virgin Olive Oil
127	Fajita Seasoning
128	Farfalle
130	Fennel Bulb
131	Fennel Seeds
132	Fenugreek
133	Feta
134	Fish Sauce
135	Flaked Almonds
136	Flax Eggs
137	Flour
138	Flour Tortilla
139	Floury Potatoes
140	Free-range Egg, Beaten
141	Free-range Eggs, Beaten
142	French Lentils
143	Fresh Basil
144	Fresh Thyme
145	Freshly Chopped Parsley
146	Fries
147	Full Fat Yogurt
148	Garam Masala
149	Garlic
150	Garlic Clove
151	Garlic Powder
152	Garlic Sauce
153	Ghee
154	Ginger
155	Ginger Cordial
156	Ginger Garlic Paste
157	Ginger Paste
158	Golden Syrup
159	Gouda Cheese
160	Granulated Sugar
161	Grape Tomatoes
162	Greek Yogurt
163	Green Beans
165	Green Chilli
166	Green Olives
167	Green Red Lentils
168	Green Salsa
169	Ground Almonds
170	Ground Cumin
171	Ground Ginger
172	Gruyère
173	Hard Taco Shells
175	Harissa Spice
176	Heavy Cream
177	Honey
178	Horseradish
179	Hot Beef Stock
180	Hotsauce
181	Ice Cream
182	Italian Fennel Sausages
183	Italian Seasoning
184	Jalapeno
185	Jasmine Rice
186	Jerusalem Artichokes
187	Kale
188	Khus Khus
189	King Prawns
190	Kosher Salt
191	Lamb
192	Lamb Loin Chops
193	Lamb Mince
194	Lasagne Sheets
195	Lean Minced Beef
196	Leek
197	Lemon
198	Lemon Juice
199	Lemon Zest
200	Lemons
201	Lettuce
202	Lime
203	Little Gem Lettuce
204	Macaroni
205	Mackerel
206	Madras Paste
207	Marjoram
208	Massaman Curry Paste
209	Medjool Dates
210	Meringue Nests
211	Milk
212	Minced Garlic
213	Miniature Marshmallows
214	Mint
215	Monterey Jack Cheese
216	Mozzarella Balls
217	Muscovado Sugar
218	Mushrooms
219	Mustard
220	Mustard Powder
221	Mustard Seeds
222	Nutmeg
223	Oil
224	Olive Oil
226	Onion Salt
227	Onions
228	Orange
229	Orange Zest
230	Oregano
231	Oyster Sauce
232	Paprika
233	Parma Ham
234	Parmesan
235	Parmesan Cheese
236	Parmigiano-reggiano
237	Parsley
238	Peanut Butter
239	Peanut Oil
240	Peanuts
241	Peas
242	Pecorino
243	Penne Rigate
244	Pepper
245	Pine Nuts
246	Pitted Black Olives
247	Plain Chocolate
248	Plain Flour
249	Plum Tomatoes
252	Potato Starch
253	Potatoes
254	Prawns
255	Puff Pastry
256	Raspberry Jam
257	Raw King Prawns
258	Red Chilli Flakes
259	Red Chilli
261	Red Chilli Powder
263	Red Onions
264	Red Pepper
265	Red Pepper Flakes
266	Red Wine
267	Refried Beans
268	Rice
269	Rice Noodles
270	Rice Stick Noodles
271	Rice Vermicelli
272	Rigatoni
273	Rocket
274	Rolled Oats
276	Saffron
277	Sage
278	Sake
280	Salsa
281	Salt
282	Salted Butter
283	Sausages
284	Sea Salt
286	Self-raising Flour
287	Semi-skimmed Milk
288	Sesame Seed
289	Shallots
290	Shredded Mexican Cheese
291	Shredded Monterey Jack Cheese
292	Small Potatoes
293	Smoked Paprika
294	Smoky Paprika
295	Sour Cream
296	Soy Sauce
297	Soya Milk
298	Spaghetti
299	Spinach
301	Spring Onions
302	Squash
303	Stir-fry Vegetables
304	Strawberries
305	Sugar
306	Sultanas
307	Sunflower Oil
308	Tamarind Ball
309	Tamarind Paste
310	Thai Fish Sauce
311	Thai Green Curry Paste
312	Thai Red Curry Paste
313	Thyme
315	Tomato Ketchup
316	Tomato Puree
317	Tomatoes
318	Toor Dal
319	Tuna
320	Turmeric
321	Turmeric Powder
322	Turnips
323	Vanilla
324	Vanilla Extract
325	Veal
326	Vegan Butter
327	Vegetable Oil
328	Vegetable Stock
329	Vegetable Stock Cube
330	Vinaigrette Dressing
331	Vine Leaves
332	Vinegar
333	Water
334	White Chocolate Chips
335	White Fish
336	White Fish Fillets
337	White Vinegar
338	White Wine
339	Whole Milk
340	Whole Wheat
341	Wholegrain Bread
342	Worcestershire Sauce
343	Yogurt
344	Zucchini
345	Pretzels
346	Cream Cheese
347	Icing Sugar
348	Toffee Popcorn
349	Caramel
350	Caramel Sauce
351	Tagliatelle
352	Fettuccine
353	Clotted Cream
354	Corn Flour
355	Mussels
356	Fideo
357	Monkfish
358	Vermicelli Pasta
359	Baby Squid
360	Squid
361	Fish Stock
362	Pilchards
363	Black Olives
364	Onion
365	Tomato
366	Duck
367	Duck Legs
368	Chicken Stock Cube
369	Pappardelle Pasta
370	Paccheri Pasta
371	Linguine Pasta
373	Sugar Snap Peas
374	Crusty Bread
375	Fromage Frais
376	Clams
377	Passata
378	Rapeseed Oil
379	Stilton Cheese
380	Lamb Leg
381	Lamb Shoulder
382	Apricot
383	Butternut Squash
384	Couscous
387	Minced Beef
388	Turkey Mince
389	Barbeque Sauce
390	Sweetcorn
391	Goose Fat
392	Duck Fat
393	Fennel
394	Red Wine Vinegar
395	Haricot Beans
396	Rosemary
397	Butter Beans
398	Pinto Beans
399	Tomato Sauce
401	Mascarpone
402	Mozzarella
403	Ricotta
405	Dried Apricots
406	Capers
407	Banana
408	Raspberries
409	Blueberries
410	Walnuts
411	Pecan Nuts
412	Maple Syrup
413	Light Brown Soft Sugar
414	Dark Brown Soft Sugar
415	Dark Chocolate Chips
416	Milk Chocolate
417	Dark Chocolate
418	Pumpkin
419	Shortcrust Pastry
420	Peanut Cookies
421	Gelatine Leafs
422	Peanut Brittle
423	Peaches
424	Yellow Pepper
425	Green Pepper
426	Courgettes
427	Tinned Tomatos
428	Chestnuts
429	Wild Mushrooms
430	Truffle Oil
431	Paneer
432	Naan Bread
433	Lentils
434	Roasted Vegetables
435	Kidney Beans
436	Mixed Grain
437	Tahini
438	Tortillas
439	Udon Noodles
440	Cabbage
441	Shiitake Mushrooms
442	Mirin
443	Sesame Seed Oil
444	Baguette
445	Vine Tomatoes
446	Suet
447	Swede
448	Ham
449	Oysters
450	Stout
451	Lard
452	Lamb Kidney
453	Beef Kidney
454	Haddock
455	Smoked Haddock
456	Brussels Sprouts
457	Raisins
458	Currants
459	Custard
460	Mixed Peel
461	Redcurrants
462	Blackberries
463	Hazlenuts
464	Braeburn Apples
465	Red Food Colouring
466	Pink Food Colouring
467	Blue Food Colouring
468	Yellow Food Colouring
469	Apricot Jam
470	Marzipan
471	Almonds
472	Black Pudding
473	Baked Beans
474	White Flour
475	Yeast
476	Fruit Mix
477	Dried Fruit
478	Cherry
479	Glace Cherry
480	Treacle
481	Oatmeal
482	Oats
483	Egg
484	Beef Shin
485	Bouquet Garni
486	Single Cream
487	Red Wine Jelly
488	Apples
489	Goats Cheese
490	Prosciutto
491	Unsalted Butter
492	Brie
493	Tarragon Leaves
494	Chives
495	Pears
496	White Chocolate
497	Star Anise
498	Tiger Prawns
499	Custard Powder
500	Desiccated Coconut
501	Frozen Peas
502	Minced Pork
503	Creamed Corn
504	Sun-Dried Tomatoes
505	Dijon Mustard
506	Tabasco Sauce
507	Canola Oil
508	Cod
509	Salt Cod
510	Ackee
511	Jerk
512	Ground Beef
513	Baby Aubergine
514	Paella Rice
515	Scotch Bonnet
516	Oxtail
517	Broad Beans
518	Red Snapper
519	Malt Vinegar
520	Rice Vinegar
521	Water Chestnut
522	Tofu
523	Doubanjiang
524	Fermented Black Beans
525	Scallions
526	Sichuan Pepper
527	Wonton Skin
528	Starch
529	Rice wine
530	Cooking wine
531	Duck Sauce
532	Gochujang
533	Bean Sprouts
534	Noodles
535	Wood Ear Mushrooms
536	Dark Rum
537	Light Rum
538	Rum
539	English Muffins
540	Muffins
541	White Wine Vinegar
542	Smoked Salmon
543	Mars Bar
544	Rice Krispies
545	Ancho Chillies
546	Almond Milk
548	Allspice
550	Almond Extract
552	Tripe
553	Goat Meat
554	Black Beans
555	Anchovy Fillet
556	Ras el hanout
557	Filo Pastry
558	Orange Blossom Water
559	Candied Peel
560	Grand Marnier
561	Sherry
562	Rose water
563	Mixed Spice
564	Mincemeat
565	Sweet Potatoes
566	Bread Rolls
567	Bun
568	Potatoe Buns
569	Ground Pork
570	Pork Chops
571	Yukon Gold Potatoes
572	Yellow Onion
573	Beef Stock Concentrate
574	Chicken Stock Concentrate
575	Persian Cucumber
576	Mayonnaise
577	Sriracha
578	Rhubarb
579	Pita Bread
580	Bulgur Wheat
581	Quinoa
582	Dill Pickles
583	Sesame Seed Burger Buns
585	Buns
586	Iceberg Lettuce
587	Gherkin Relish
588	Cheese Slices
589	Shortening
590	Warm Water
591	Boiling Water
592	Pickle Juice
593	Powdered Sugar
594	Kielbasa
595	Polish Sausage
596	Sauerkraut
597	Caraway Seed
598	Herring
599	Jam
600	Mulukhiyah
601	Sushi Rice
602	Figs
603	Cider
604	Beetroot
605	Sardines
606	Ciabatta
607	Buckwheat
608	Prunes
\.


--
-- TOC entry 3327 (class 0 OID 16570)
-- Dependencies: 215
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password) FROM stdin;
\.


--
-- TOC entry 3337 (class 0 OID 0)
-- Dependencies: 216
-- Name: recipeingrediants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recipeingrediants_id_seq', 1, false);


--
-- TOC entry 3338 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- TOC entry 3181 (class 2606 OID 16579)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3183 (class 2606 OID 16577)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2025-04-01 02:15:48

--
-- PostgreSQL database dump complete
--

