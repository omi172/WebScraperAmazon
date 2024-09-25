const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set user-agent to avoid bot detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');

  // Array of Amazon search result page URLs for L4 categories
  const urls = ["https://www.amazon.in/s?i=apparel&bbn=1968024031&rh=n%3A1968076031%2Cp_85%3A10440599031%2Cp_123%3A140036%7C1446980%7C1483065%7C156780%7C200356%7C232621%7C232755%7C232761%7C232762%7C232763%7C240905%7C319726%7C339433%7C373328%7C3878%7C390827%7C393482%7C398346%7C406102%7C411593%7C424710%7C435051%7C46245%7C472933%7C478007%7C484445%7C586466%7C613702%7C951834%2Cp_n_pct-off-with-tax%3A2665401031%2Cp_36%3A130000-&s=relevancerank&dc&hidden-keywords=-women-woman&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=b45b932c-646e-4600-be1a-b26d0c52b50b&pf_rd_p=e29e8037-c158-44bb-8fe1-330308effa0c&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=TBFR4BC0EDQNZFJ2VVH5&pf_rd_s=merchandised-search-18&qid=1724910779&rnid=4595083031&ref=sr_nr_p_36_0_0",
    "https://www.amazon.in/s?k=formal+shirts&i=apparel&rh=n%3A94998646031%2Cp_123%3A179318%7C232761%7C373328%7C382402%7C398346%7C400612%7C484445%7C551011%7C555883%7C945449%2Cp_36%3A70000-%2Cp_85%3A10440599031%2Cp_n_pct-off-with-tax%3A2665402031&s=relevancerank&dc&hidden-keywords=-women-pack&ds=v1%3AwRFKQGuqU0oFXXNLkoVBCZi3bHbJ3Ge3MDy9wLfOcbM&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1713866152&rnid=2665398031&ref=sr_nr_p_n_pct-off-with-tax_3",
    "https://www.amazon.in/s?i=apparel&bbn=1968024031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968125031%2Cn%3A5836982031%2Cp_89%3AAllen+Solly%7CAmazon+Brand+-+Symbol%7CArrow%7CArrow+New+York%7CCAVALLO+by+Linen+Club%7CDiverse%7CMarks+%26+Spencer%7CPark+Avenue%7CPeter+England%7CRaymond%7CThe+Pant+Project%7CTommy+Hilfiger%7CUnited+Colors+of+Benetton%7CVan+Heusen%7Cblackberrys%2Cp_85%3A10440599031%2Cp_36%3A115900-%2Cp_n_pct-off-with-tax%3A2665401031&s=apparel&dc&ds=v1%3A%2F8XRzwwikMeV3SK2s0ktzU7O59sJStsL%2BJcpYCMCJbs&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&pf_rd_s=mobile-hybrid-8&pf_rd_t=30901&qid=1713866217&rnid=2665398031&ref=sr_nr_p_n_pct-off-with-tax_4",
    "https://www.amazon.in/s?i=apparel&bbn=1968111031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968107031%2Cn%3A1968111031%2Cp_85%3A10440599031%2Cp_n_pct-off-with-tax%3A0-%2Cp_89%3AAllen+Solly%7CArrow%7CBlackberrys%7CMarks+and+Spencer%7CPARK+AVENUE%7CPark+Avenue%7CPeter+England%7CRaymond%7CTommy+Hilfiger%7CVan+Heusen%7Cblackberrys%2Cp_36%3A200000-&s=review-rank&dc&hidden-keywords=-women-woman-girl-boy-tshirt-polo-casual-jeans-sunglass-spectacle-shorts-sportswear-inner-brief-innerwear-rainwear-accessories-bandana-glocves-kurta-dhoti-mundu-lungi-sleep-loungewear-unstitched-fabric-swimwear-winterwear-waistcoat-nehru-dhoti-mundu-sleep-pyjama-jacket-coat-sweater-sherwani-nehru-square-gloves-mask-women&_encoding=UTF8&_encoding=UTF8&_encoding=UTF8%2CUTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1711697285&rnid=14302814031&ref=sr_nr_p_36_1",
    "https://www.amazon.in/s?i=apparel&bbn=1968108031&rh=n%3A1968108031%2Cp_85%3A10440599031%2Cp_36%3A250000-%2Cp_89%3AArrow%7CPark+Avenue%7CPeter+England%7CRaymond%7CVan+Heusen%7Cblackberrys&s=review-rank&dc&_encoding=UTF8&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1711697557&rnid=14302814031&ref=sr_nr_p_36_2",
    "https://www.amazon.in/s?i=apparel&bbn=1968057031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968025031%2Cn%3A1968057031%2Cp_85%3A10440599031%2Cp_n_feature_nineteen_browse-bin%3A11301357031%7C27064186031%2Cp_36%3A29900-%2Cp_72%3A1318477031&s=apparel&dc&page=2&hidden-keywords=-casual-women-boys-girls-sports&_encoding=UTF8&_encoding=UTF8%2CUTF8%2CUTF8%2CUTF8%2CUTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1727084233&rnid=1318475031&ref=sr_pg_2",
    "https://www.amazon.in/s?i=apparel&bbn=1968057031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968025031%2Cn%3A1968057031%2Cp_85%3A10440599031%2Cp_n_feature_nineteen_browse-bin%3A11301357031%7C27064186031%2Cp_36%3A29900-%2Cp_72%3A1318477031&s=apparel&dc&page=2&hidden-keywords=-casual-women-boys-girls-sports&_encoding=UTF8&_encoding=UTF8%2CUTF8%2CUTF8%2CUTF8%2CUTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1727084233&rnid=1318475031&ref=sr_pg_3",
    "https://www.amazon.in/s?i=apparel&bbn=1968057031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968025031%2Cn%3A1968057031%2Cp_85%3A10440599031%2Cp_n_feature_nineteen_browse-bin%3A11301357031%7C27064186031%2Cp_36%3A29900-%2Cp_72%3A1318477031&s=apparel&dc&hidden-keywords=-casual-women-boys-girls-sports&ds=v1%3AsICMdoakMhdJy2of7vloODahbBNLZd6XFxRaBKvjiKU&_encoding=UTF8&_encoding=UTF8%2CUTF8%2CUTF8%2CUTF8%2CUTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1711698489&rnid=1318475031&ref=sr_nr_p_72_2",
    "https://www.amazon.in/s?i=apparel&bbn=1968027031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968025031%2Cn%3A1968027031%2Cp_85%3A10440599031%2Cp_n_feature_nineteen_browse-bin%3A27064186031%2Cp_36%3A60000-&s=apparel&dc&hidden-keywords=-women-girls-boys-casual&ds=v1%3AUuDRUH73BeI6%2F1%2BpvBGwxyRiGgUvVvMusjbi3N73VHg&_encoding=UTF8&_encoding=UTF8%2CUTF8%2CUTF8%2CUTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1711698588&ref=sr_ex_p_n_pct-off-with-tax_0",
    "https://www.amazon.in/s?i=apparel&bbn=1968035031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968032031%2Cn%3A1968035031%2Cp_85%3A10440599031%2Cp_n_feature_nineteen_browse-bin%3A11301357031%7C27064186031&s=apparel&dc&ds=v1%3AxzWFn%2FdbcV4V%2FLyppimftLtEshZKpekOyu2FUtquN7o&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1696362818&rnid=11301356031&ref=sr_nr_p_n_feature_nineteen_browse-bin_1", 
    "https://www.amazon.in/s?i=apparel&bbn=1968025031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968025031%2Cn%3A1968038031%2Cp_85%3A10440599031%2Cp_n_feature_nineteen_browse-bin%3A27064186031&s=popularity-rank&dc&ds=v1%3AIoDPWEeXdstXlboQgBzCQrQNbKFgnWYB8pL5T6xCUYw&_encoding=UTF8&_encoding=UTF8%2CUTF8%2CUTF8%2CUTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1711698682&rnid=11301356031&ref=sr_nr_p_n_feature_nineteen_browse-bin_1",
  "https://www.amazon.in/s?i=apparel&bbn=1968024031&rh=n%3A1968076031%2Cp_85%3A10440599031%2Cp_123%3A140036%7C1446980%7C1483065%7C156780%7C200356%7C232621%7C232755%7C232761%7C232762%7C232763%7C240905%7C319726%7C339433%7C373328%7C3878%7C390827%7C393482%7C398346%7C406102%7C411593%7C424710%7C435051%7C46245%7C472933%7C478007%7C484445%7C586466%7C613702%7C951834%2Cp_n_pct-off-with-tax%3A2665401031%2Cp_36%3A130000-&s=relevancerank&dc&page=2&hidden-keywords=-women-woman&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=b45b932c-646e-4600-be1a-b26d0c52b50b&pf_rd_p=e29e8037-c158-44bb-8fe1-330308effa0c&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=TBFR4BC0EDQNZFJ2VVH5&pf_rd_s=merchandised-search-18&qid=1727083830&rnid=4595083031&ref=sr_pg_2",
"https://www.amazon.in/s?i=apparel&bbn=1968024031&rh=n%3A1968076031%2Cp_85%3A10440599031%2Cp_123%3A140036%7C1446980%7C1483065%7C156780%7C200356%7C232621%7C232755%7C232761%7C232762%7C232763%7C240905%7C319726%7C339433%7C373328%7C3878%7C390827%7C393482%7C398346%7C406102%7C411593%7C424710%7C435051%7C46245%7C472933%7C478007%7C484445%7C586466%7C613702%7C951834%2Cp_n_pct-off-with-tax%3A2665401031%2Cp_36%3A130000-&s=relevancerank&dc&page=2&hidden-keywords=-women-woman&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=b45b932c-646e-4600-be1a-b26d0c52b50b&pf_rd_p=e29e8037-c158-44bb-8fe1-330308effa0c&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=TBFR4BC0EDQNZFJ2VVH5&pf_rd_s=merchandised-search-18&qid=1727083830&rnid=4595083031&ref=sr_pg_3",
"https://www.amazon.in/s?i=apparel&bbn=1968024031&rh=n%3A1968076031%2Cp_85%3A10440599031%2Cp_123%3A140036%7C1446980%7C1483065%7C156780%7C200356%7C232621%7C232755%7C232761%7C232762%7C232763%7C240905%7C319726%7C339433%7C373328%7C3878%7C390827%7C393482%7C398346%7C406102%7C411593%7C424710%7C435051%7C46245%7C472933%7C478007%7C484445%7C586466%7C613702%7C951834%2Cp_n_pct-off-with-tax%3A2665401031%2Cp_36%3A130000-&s=relevancerank&dc&page=2&hidden-keywords=-women-woman&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=b45b932c-646e-4600-be1a-b26d0c52b50b&pf_rd_p=e29e8037-c158-44bb-8fe1-330308effa0c&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=TBFR4BC0EDQNZFJ2VVH5&pf_rd_s=merchandised-search-18&qid=1727083830&rnid=4595083031&ref=sr_pg_4",
"https://www.amazon.in/s?i=apparel&bbn=1968024031&rh=n%3A1968076031%2Cp_85%3A10440599031%2Cp_123%3A140036%7C1446980%7C1483065%7C156780%7C200356%7C232621%7C232755%7C232761%7C232762%7C232763%7C240905%7C319726%7C339433%7C373328%7C3878%7C390827%7C393482%7C398346%7C406102%7C411593%7C424710%7C435051%7C46245%7C472933%7C478007%7C484445%7C586466%7C613702%7C951834%2Cp_n_pct-off-with-tax%3A2665401031%2Cp_36%3A130000-&s=relevancerank&dc&page=2&hidden-keywords=-women-woman&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=b45b932c-646e-4600-be1a-b26d0c52b50b&pf_rd_p=e29e8037-c158-44bb-8fe1-330308effa0c&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=TBFR4BC0EDQNZFJ2VVH5&pf_rd_s=merchandised-search-18&qid=1727083830&rnid=4595083031&ref=sr_pg_5",
"https://www.amazon.in/s?k=formal+shirts&i=apparel&rh=n%3A94998646031%2Cp_123%3A179318%7C232761%7C373328%7C382402%7C398346%7C400612%7C484445%7C551011%7C555883%7C945449%2Cp_36%3A70000-%2Cp_85%3A10440599031%2Cp_n_pct-off-with-tax%3A2665402031&s=relevancerank&dc&page=2&hidden-keywords=-women-pack&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1727083990&rnid=2665398031&ref=sr_pg_2",
"https://www.amazon.in/s?k=formal+shirts&i=apparel&rh=n%3A94998646031%2Cp_123%3A179318%7C232761%7C373328%7C382402%7C398346%7C400612%7C484445%7C551011%7C555883%7C945449%2Cp_36%3A70000-%2Cp_85%3A10440599031%2Cp_n_pct-off-with-tax%3A2665402031&s=relevancerank&dc&page=2&hidden-keywords=-women-pack&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1727083990&rnid=2665398031&ref=sr_pg_3",
"https://www.amazon.in/s?k=formal+shirts&i=apparel&rh=n%3A94998646031%2Cp_123%3A179318%7C232761%7C373328%7C382402%7C398346%7C400612%7C484445%7C551011%7C555883%7C945449%2Cp_36%3A70000-%2Cp_85%3A10440599031%2Cp_n_pct-off-with-tax%3A2665402031&s=relevancerank&dc&page=2&hidden-keywords=-women-pack&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1727083990&rnid=2665398031&ref=sr_pg_4",
"https://www.amazon.in/s?k=formal+shirts&i=apparel&rh=n%3A94998646031%2Cp_123%3A179318%7C232761%7C373328%7C382402%7C398346%7C400612%7C484445%7C551011%7C555883%7C945449%2Cp_36%3A70000-%2Cp_85%3A10440599031%2Cp_n_pct-off-with-tax%3A2665402031&s=relevancerank&dc&page=2&hidden-keywords=-women-pack&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1727083990&rnid=2665398031&ref=sr_pg_5",
"https://www.amazon.in/s?i=apparel&bbn=1968024031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968125031%2Cn%3A5836982031%2Cp_89%3AAllen+Solly%7CAmazon+Brand+-+Symbol%7CArrow%7CArrow+New+York%7CCAVALLO+by+Linen+Club%7CDiverse%7CMarks+%26+Spencer%7CPark+Avenue%7CPeter+England%7CRaymond%7CThe+Pant+Project%7CTommy+Hilfiger%7CUnited+Colors+of+Benetton%7CVan+Heusen%7Cblackberrys%2Cp_85%3A10440599031%2Cp_36%3A115900-%2Cp_n_pct-off-with-tax%3A2665401031&s=apparel&dc&page=2&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&pf_rd_s=mobile-hybrid-8&pf_rd_t=30901&qid=1727084054&rnid=2665398031&ref=sr_pg_2",
"https://www.amazon.in/s?i=apparel&bbn=1968024031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968125031%2Cn%3A5836982031%2Cp_89%3AAllen+Solly%7CAmazon+Brand+-+Symbol%7CArrow%7CArrow+New+York%7CCAVALLO+by+Linen+Club%7CDiverse%7CMarks+%26+Spencer%7CPark+Avenue%7CPeter+England%7CRaymond%7CThe+Pant+Project%7CTommy+Hilfiger%7CUnited+Colors+of+Benetton%7CVan+Heusen%7Cblackberrys%2Cp_85%3A10440599031%2Cp_36%3A115900-%2Cp_n_pct-off-with-tax%3A2665401031&s=apparel&dc&page=2&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&pf_rd_s=mobile-hybrid-8&pf_rd_t=30901&qid=1727084054&rnid=2665398031&ref=sr_pg_3",
"https://www.amazon.in/s?i=apparel&bbn=1968024031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968125031%2Cn%3A5836982031%2Cp_89%3AAllen+Solly%7CAmazon+Brand+-+Symbol%7CArrow%7CArrow+New+York%7CCAVALLO+by+Linen+Club%7CDiverse%7CMarks+%26+Spencer%7CPark+Avenue%7CPeter+England%7CRaymond%7CThe+Pant+Project%7CTommy+Hilfiger%7CUnited+Colors+of+Benetton%7CVan+Heusen%7Cblackberrys%2Cp_85%3A10440599031%2Cp_36%3A115900-%2Cp_n_pct-off-with-tax%3A2665401031&s=apparel&dc&page=2&_encoding=UTF8&pf_rd_i=1968024031&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&pf_rd_s=mobile-hybrid-8&pf_rd_t=30901&qid=1727084054&rnid=2665398031&ref=sr_pg_4",
"https://www.amazon.in/s?i=apparel&bbn=1968111031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968107031%2Cn%3A1968111031%2Cp_85%3A10440599031%2Cp_n_pct-off-with-tax%3A0-%2Cp_89%3AAllen+Solly%7CArrow%7CBlackberrys%7CMarks+and+Spencer%7CPARK+AVENUE%7CPark+Avenue%7CPeter+England%7CRaymond%7CTommy+Hilfiger%7CVan+Heusen%7Cblackberrys%2Cp_36%3A200000-&s=review-rank&dc&page=2&hidden-keywords=-women-woman-girl-boy-tshirt-polo-casual-jeans-sunglass-spectacle-shorts-sportswear-inner-brief-innerwear-rainwear-accessories-bandana-glocves-kurta-dhoti-mundu-lungi-sleep-loungewear-unstitched-fabric-swimwear-winterwear-waistcoat-nehru-dhoti-mundu-sleep-pyjama-jacket-coat-sweater-sherwani-nehru-square-gloves-mask-women&_encoding=UTF8&_encoding=UTF8&_encoding=UTF8%2CUTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1727084127&rnid=14302814031&ref=sr_pg_2",
"https://www.amazon.in/s?i=apparel&bbn=1968111031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968107031%2Cn%3A1968111031%2Cp_85%3A10440599031%2Cp_n_pct-off-with-tax%3A0-%2Cp_89%3AAllen+Solly%7CArrow%7CBlackberrys%7CMarks+and+Spencer%7CPARK+AVENUE%7CPark+Avenue%7CPeter+England%7CRaymond%7CTommy+Hilfiger%7CVan+Heusen%7Cblackberrys%2Cp_36%3A200000-&s=review-rank&dc&page=2&hidden-keywords=-women-woman-girl-boy-tshirt-polo-casual-jeans-sunglass-spectacle-shorts-sportswear-inner-brief-innerwear-rainwear-accessories-bandana-glocves-kurta-dhoti-mundu-lungi-sleep-loungewear-unstitched-fabric-swimwear-winterwear-waistcoat-nehru-dhoti-mundu-sleep-pyjama-jacket-coat-sweater-sherwani-nehru-square-gloves-mask-women&_encoding=UTF8&_encoding=UTF8&_encoding=UTF8%2CUTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1727084127&rnid=14302814031&ref=sr_pg_3",
"https://www.amazon.in/s?i=apparel&bbn=1968111031&rh=n%3A1571271031%2Cn%3A1968024031%2Cn%3A1968107031%2Cn%3A1968111031%2Cp_85%3A10440599031%2Cp_n_pct-off-with-tax%3A0-%2Cp_89%3AAllen+Solly%7CArrow%7CBlackberrys%7CMarks+and+Spencer%7CPARK+AVENUE%7CPark+Avenue%7CPeter+England%7CRaymond%7CTommy+Hilfiger%7CVan+Heusen%7Cblackberrys%2Cp_36%3A200000-&s=review-rank&dc&page=2&hidden-keywords=-women-woman-girl-boy-tshirt-polo-casual-jeans-sunglass-spectacle-shorts-sportswear-inner-brief-innerwear-rainwear-accessories-bandana-glocves-kurta-dhoti-mundu-lungi-sleep-loungewear-unstitched-fabric-swimwear-winterwear-waistcoat-nehru-dhoti-mundu-sleep-pyjama-jacket-coat-sweater-sherwani-nehru-square-gloves-mask-women&_encoding=UTF8&_encoding=UTF8&_encoding=UTF8%2CUTF8&pf_rd_i=1968024031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=c3a8b7bc-839d-4488-a9c1-16159fa5e629&pf_rd_p=f77316b8-be18-47b3-bf5e-efb2f5a3cb6b&pf_rd_r=FSWNQTDTHX11PS0XYQNG&pf_rd_r=JBA2VZ77E6SZ2PFE5P4A&pf_rd_s=merchandised-search-20&qid=1727084127&rnid=14302814031&ref=sr_pg_4"]


  const productData = [];

  // Loop through each search result page
  for (let i = 0; i < urls.length; i++) {
    await page.goto(urls[i], { waitUntil: 'networkidle2' });

    // Wait for search result products to load
    await page.waitForSelector('.s-search-results');

    // Scrape product URLs from the search result page
    const productUrls = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.s-main-slot a.a-link-normal.a-text-normal'));
      return links.map(link => link.href).slice(0, 250); // Get top 250 product URLs
    });

    // Navigate to each product page and scrape details
    for (let productUrl of productUrls) {
      await page.goto(productUrl, { waitUntil: 'networkidle2' });

      // Scrape the product name and price
      const productDetails = await page.evaluate(() => {
        const productTitle = document.querySelector('#productTitle') ? document.querySelector('#productTitle').innerText.trim() : null;
        const productPrice = document.querySelector('.a-price .a-offscreen') ? document.querySelector('.a-price .a-offscreen').innerText.trim() : 'Price not available';
        return { productTitle, productPrice };
      });

      // Wait for reviews section to load
      try {
        await page.waitForSelector('#cm-cr-dp-review-list', { timeout: 5000 });
      } catch (error) {
        console.log(`No reviews found`);
        continue;
      }

      // Scrape reviews, ratings, and reviewer names
      const reviews = await page.evaluate(() => {
        const reviewElements = document.querySelectorAll('.review');
        const scrapedReviews = [];

        reviewElements.forEach((reviewElement) => {
          const rating = reviewElement.querySelector('.review-rating') ? reviewElement.querySelector('.review-rating').innerText : null;
          const reviewText = reviewElement.querySelector('.review-text') ? reviewElement.querySelector('.review-text').innerText : null;
          const reviewerName = reviewElement.querySelector('.a-profile-name') ? reviewElement.querySelector('.a-profile-name').innerText : null;

          scrapedReviews.push({
            rating,
            reviewText,
            reviewerName,
          });
        });

        return scrapedReviews;
      });

      // Push the scraped data (including product name, price, and reviews) into productData array
      reviews.forEach(review => {
        productData.push({
          productName: productDetails.productTitle,
          ...review
        });
      });
    }
  }

  // Output the scraped data
  const csvHeaders = 'Product Name,Rating,Review Text,Reviewer Name\n';
  const csvRows = productData.map(item => 
    `${item.productName || ''},${item.rating || ''},${item.reviewText || ''},${item.reviewerName || ''}`
  ).join('\n');

  const csvContent = csvHeaders + csvRows;

  // Write CSV to a file
  fs.writeFileSync('fashion_product_reviews_with_price2.csv', csvContent, 'utf8');

  console.log('Data written to fashion_product_reviews_with_price.csv');

  // Close the browser
  await browser.close();
})();
