--
-- PostgreSQL database dump
--

\restrict LYqdra0pW87UdMz9fP2o37Z3g83tDAOQtlUcmKdXHIz00YPQvyiu4p30Us7n1Fr

-- Dumped from database version 14.22 (Ubuntu 14.22-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.22 (Ubuntu 14.22-0ubuntu0.22.04.1)

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

--
-- Name: BookmarkStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BookmarkStatus" AS ENUM (
    'Active',
    'Archived'
);


ALTER TYPE public."BookmarkStatus" OWNER TO postgres;

--
-- Name: RiskTier; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RiskTier" AS ENUM (
    'Critical',
    'High',
    'Medium',
    'Low'
);


ALTER TYPE public."RiskTier" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Bookmark; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Bookmark" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name text NOT NULL,
    description text,
    status public."BookmarkStatus" DEFAULT 'Active'::public."BookmarkStatus" NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Bookmark" OWNER TO postgres;

--
-- Name: BookmarkCompany; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BookmarkCompany" (
    id integer NOT NULL,
    "bookmarkId" integer NOT NULL,
    "companyId" integer NOT NULL,
    "bookmarkedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BookmarkCompany" OWNER TO postgres;

--
-- Name: BookmarkCompany_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BookmarkCompany_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."BookmarkCompany_id_seq" OWNER TO postgres;

--
-- Name: BookmarkCompany_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BookmarkCompany_id_seq" OWNED BY public."BookmarkCompany".id;


--
-- Name: Bookmark_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Bookmark_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Bookmark_id_seq" OWNER TO postgres;

--
-- Name: Bookmark_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Bookmark_id_seq" OWNED BY public."Bookmark".id;


--
-- Name: CompanyCollection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CompanyCollection" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "companyName" text NOT NULL,
    "companyNickname" text NOT NULL,
    sector text NOT NULL,
    "riskScore" integer NOT NULL,
    "riskTier" public."RiskTier" NOT NULL,
    etr_score double precision DEFAULT 0 NOT NULL,
    margin_score double precision DEFAULT 0 NOT NULL,
    rp_haven_score double precision DEFAULT 0 NOT NULL,
    debt_score double precision DEFAULT 0 NOT NULL,
    ownership_score double precision DEFAULT 0 NOT NULL,
    conduct_score double precision DEFAULT 0 NOT NULL,
    persistence_multiplier double precision DEFAULT 1.0 NOT NULL,
    methods text[],
    revenue integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CompanyCollection" OWNER TO postgres;

--
-- Name: CompanyCollection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CompanyCollection_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CompanyCollection_id_seq" OWNER TO postgres;

--
-- Name: CompanyCollection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CompanyCollection_id_seq" OWNED BY public."CompanyCollection".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    username text NOT NULL,
    "fullName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Bookmark id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookmark" ALTER COLUMN id SET DEFAULT nextval('public."Bookmark_id_seq"'::regclass);


--
-- Name: BookmarkCompany id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookmarkCompany" ALTER COLUMN id SET DEFAULT nextval('public."BookmarkCompany_id_seq"'::regclass);


--
-- Name: CompanyCollection id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyCollection" ALTER COLUMN id SET DEFAULT nextval('public."CompanyCollection_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Bookmark; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Bookmark" (id, "userId", name, description, status, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: BookmarkCompany; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BookmarkCompany" (id, "bookmarkId", "companyId", "bookmarkedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CompanyCollection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CompanyCollection" (id, "userId", "companyName", "companyNickname", sector, "riskScore", "riskTier", etr_score, margin_score, rp_haven_score, debt_score, ownership_score, conduct_score, persistence_multiplier, methods, revenue, "createdAt", "updatedAt") FROM stdin;
27	1	TechCorp Industries	TechCorp	Technology	85	Critical	8.5	7.2	9.1	6.8	8.9	7.5	1.2	{"Transfer Pricing","Royalty Stripping"}	2500000	2026-04-04 08:19:42.146	2026-04-04 08:19:42.146
28	1	Global Manufacturing Ltd	GlobalMfg	Manufacturing	72	High	6.2	8.1	7.8	8.5	6.9	8.2	1.1	{"Transfer Pricing","Debt Shifting"}	1800000	2026-04-04 08:19:42.157	2026-04-04 08:19:42.157
29	1	Retail Solutions Inc	RetailSol	Retail	45	Medium	4.5	5.8	4.2	5.1	4.8	5.9	1	{"Transfer Pricing"}	950000	2026-04-04 08:19:42.162	2026-04-04 08:19:42.162
30	1	Healthcare Systems Corp	HealthSys	Healthcare	28	Low	2.8	3.2	2.9	3.1	2.5	3.8	0.9	{"Shell Layering"}	750000	2026-04-04 08:19:42.168	2026-04-04 08:19:42.168
31	1	Energy Solutions Group	EnergySol	Energy	68	High	7.1	6.8	8.2	7.5	7.9	6.7	1.15	{"Transfer Pricing","Royalty Stripping","Debt Shifting"}	3200000	2026-04-04 08:19:42.175	2026-04-04 08:19:42.175
32	1	Financial Services Hub	FinHub	Financial Services	55	Medium	5.5	6.2	5.8	5.9	5.1	6.4	1.05	{"Transfer Pricing","Shell Layering"}	1400000	2026-04-04 08:19:42.181	2026-04-04 08:19:42.181
33	1	Construction & Building Co	BuildCo	Construction	38	Low	3.8	4.1	3.9	4.2	3.5	4.7	0.95	{"Debt Shifting"}	600000	2026-04-04 08:19:42.187	2026-04-04 08:19:42.187
34	1	Pharmaceutical Innovations	PharmaInnov	Pharmaceutical	78	High	7.8	8.5	8.9	7.2	8.1	7.8	1.25	{"Transfer Pricing","Royalty Stripping"}	2800000	2026-04-04 08:19:42.192	2026-04-04 08:19:42.192
35	1	Transportation Networks	TransNet	Transportation	42	Medium	4.2	4.8	4.5	4.9	4.1	5.2	1	{"Transfer Pricing","Debt Shifting"}	1100000	2026-04-04 08:19:42.199	2026-04-04 08:19:42.199
36	1	Agriculture Tech Solutions	AgriTech	Agriculture	25	Low	2.5	2.8	2.6	2.9	2.2	3.1	0.85	{"Shell Layering"}	450000	2026-04-04 08:19:42.205	2026-04-04 08:19:42.205
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, username, "fullName", "createdAt", "updatedAt") FROM stdin;
1	seeduser@example.com	$2b$10$9nBRSC5lQif.pQlMl0gHfe.r1lGbzubRRIW/QdxLfUtSTGYot2eay	seeduser	Seed User	2026-04-03 09:05:11.149	2026-04-03 09:05:11.149
\.


--
-- Name: BookmarkCompany_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BookmarkCompany_id_seq"', 10, true);


--
-- Name: Bookmark_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Bookmark_id_seq"', 5, true);


--
-- Name: CompanyCollection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CompanyCollection_id_seq"', 36, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: BookmarkCompany BookmarkCompany_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookmarkCompany"
    ADD CONSTRAINT "BookmarkCompany_pkey" PRIMARY KEY (id);


--
-- Name: Bookmark Bookmark_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_pkey" PRIMARY KEY (id);


--
-- Name: CompanyCollection CompanyCollection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyCollection"
    ADD CONSTRAINT "CompanyCollection_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: BookmarkCompany_bookmarkId_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BookmarkCompany_bookmarkId_companyId_key" ON public."BookmarkCompany" USING btree ("bookmarkId", "companyId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: BookmarkCompany BookmarkCompany_bookmarkId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookmarkCompany"
    ADD CONSTRAINT "BookmarkCompany_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES public."Bookmark"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BookmarkCompany BookmarkCompany_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookmarkCompany"
    ADD CONSTRAINT "BookmarkCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."CompanyCollection"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Bookmark Bookmark_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookmark"
    ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CompanyCollection CompanyCollection_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyCollection"
    ADD CONSTRAINT "CompanyCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict LYqdra0pW87UdMz9fP2o37Z3g83tDAOQtlUcmKdXHIz00YPQvyiu4p30Us7n1Fr

