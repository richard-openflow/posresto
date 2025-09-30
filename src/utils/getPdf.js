import moment from "moment/moment"


const getPdf = ({ PointOfSale, Orders }) => {
  return `<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="utf-8">
      <meta name="generator" content="pdf2htmlEX">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <style type="text/css">
        /*! 
   * Base CSS for pdf2htmlEX
   * Copyright 2012,2013 Lu Wang 
                          <coolwanglu@gmail.com> 
   * https://github.com/pdf2htmlEX/pdf2htmlEX/blob/master/share/LICENSE
   */
        #sidebar {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 250px;
          padding: 0;
          margin: 0;
          overflow: auto
        }
  
        #page-container {
          position: absolute;
          top: 0;
          left: 0;
          margin: 0;
          padding: 0;
          border: 0
        }
  
        @media screen {
          #sidebar.opened+#page-container {
            left: 250px
          }
  
          #page-container {
            bottom: 0;
            right: 0;
            overflow: auto
          }
  
          .loading-indicator {
            display: none
          }
  
          .loading-indicator.active {
            display: block;
            position: absolute;
            width: 64px;
            height: 64px;
            top: 50%;
            left: 50%;
            margin-top: -32px;
            margin-left: -32px
          }
  
          .loading-indicator img {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0
          }
        }
  
        @media print {
          @page {
            margin: 0
          }
  
          html {
            margin: 0
          }
  
          body {
            margin: 0;
            -webkit-print-color-adjust: exact
          }
  
          #sidebar {
            display: none
          }
  
          #page-container {
            width: auto;
            height: auto;
            overflow: visible;
            background-color: transparent
          }
  
          .d {
            display: none
          }
        }
  
        .pf {
          position: relative;
          background-color: white;
          overflow: hidden;
          margin: 0;
          border: 0
        }
  
        .pc {
          position: absolute;
          border: 0;
          padding: 0;
          margin: 0;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: block;
          transform-origin: 0 0;
          -ms-transform-origin: 0 0;
          -webkit-transform-origin: 0 0
        }
  
        .pc.opened {
          display: block
        }
  
        .bf {
          position: absolute;
          border: 0;
          margin: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          -ms-user-select: none;
          -moz-user-select: none;
          -webkit-user-select: none;
          user-select: none
        }
  
        .bi {
          position: absolute;
          border: 0;
          margin: 0;
          -ms-user-select: none;
          -moz-user-select: none;
          -webkit-user-select: none;
          user-select: none
        }
  
        @media print {
          .pf {
            margin: 0;
            box-shadow: none;
            page-break-after: always;
            page-break-inside: avoid
          }
  
          @-moz-document url-prefix() {
            .pf {
              overflow: visible;
              border: 1px solid #fff
            }
  
            .pc {
              overflow: visible
            }
          }
        }
  
        .c {
          position: absolute;
          border: 0;
          padding: 0;
          margin: 0;
          overflow: hidden;
          display: block
        }
  
        .t {
          position: absolute;
          white-space: pre;
          font-size: 1px;
          transform-origin: 0 100%;
          -ms-transform-origin: 0 100%;
          -webkit-transform-origin: 0 100%;
          unicode-bidi: bidi-override;
          -moz-font-feature-settings: "liga"0
        }
  
        .t:after {
          content: ''
        }
  
        .t:before {
          content: '';
          display: inline-block
        }
  
        .t span {
          position: relative;
          unicode-bidi: bidi-override
        }
  
        ._ {
          display: inline-block;
          color: transparent;
          z-index: -1
        }
  
        ::selection {
          background: rgba(127, 255, 255, 0.4)
        }
  
        ::-moz-selection {
          background: rgba(127, 255, 255, 0.4)
        }
  
        .pi {
          display: none
        }
  
        .d {
          position: absolute;
          transform-origin: 0 100%;
          -ms-transform-origin: 0 100%;
          -webkit-transform-origin: 0 100%
        }
  
        .it {
          border: 0;
          background-color: rgba(255, 255, 255, 0.0)
        }
  
        .ir:hover {
          cursor: pointer
        }
      </style>
      <style type="text/css">
        /*! 
   * Fancy styles for pdf2htmlEX
   * Copyright 2012,2013 Lu Wang 
                              <coolwanglu@gmail.com> 
   * https://github.com/pdf2htmlEX/pdf2htmlEX/blob/master/share/LICENSE
   */
        @keyframes fadein {
          from {
            opacity: 0
          }
  
          to {
            opacity: 1
          }
        }
  
        @-webkit-keyframes fadein {
          from {
            opacity: 0
          }
  
          to {
            opacity: 1
          }
        }
  
        @keyframes swing {
          0 {
            transform: rotate(0)
          }
  
          10% {
            transform: rotate(0)
          }
  
          90% {
            transform: rotate(720deg)
          }
  
          100% {
            transform: rotate(720deg)
          }
        }
  
        @-webkit-keyframes swing {
          0 {
            -webkit-transform: rotate(0)
          }
  
          10% {
            -webkit-transform: rotate(0)
          }
  
          90% {
            -webkit-transform: rotate(720deg)
          }
  
          100% {
            -webkit-transform: rotate(720deg)
          }
        }
  
        @media screen {
          #sidebar {
            background-color: #2f3236;
            background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjNDAzYzNmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9IiMxZTI5MmQiPjwvcGF0aD4KPC9zdmc+")
          }
  
          #outline {
            font-family: Georgia, Times, "Times New Roman", serif;
            font-size: 13px;
            margin: 2em 1em
          }
  
          #outline ul {
            padding: 0
          }
  
          #outline li {
            list-style-type: none;
            margin: 1em 0
          }
  
          #outline li>ul {
            margin-left: 1em
          }
  
          #outline a,
          #outline a:visited,
          #outline a:hover,
          #outline a:active {
            line-height: 1.2;
            color: #e8e8e8;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-decoration: none;
            display: block;
            overflow: hidden;
            outline: 0
          }
  
          #outline a:hover {
            color: #0cf
          }
  
          #page-container {
            background-color: #9e9e9e;
            background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjOWU5ZTllIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=");
            -webkit-transition: left 500ms;
            transition: left 500ms
          }
  
          .pf {
            margin: 13px auto;
            box-shadow: 1px 1px 3px 1px #333;
            border-collapse: separate
          }
  
          .pc.opened {
            -webkit-animation: fadein 100ms;
            animation: fadein 100ms
          }
  
          .loading-indicator.active {
            -webkit-animation: swing 1.5s ease-in-out .01s infinite alternate none;
            animation: swing 1.5s ease-in-out .01s infinite alternate none
          }
  
          .checked {
            background: no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3goQDSYgDiGofgAAAslJREFUOMvtlM9LFGEYx7/vvOPM6ywuuyPFihWFBUsdNnA6KLIh+QPx4KWExULdHQ/9A9EfUodYmATDYg/iRewQzklFWxcEBcGgEplDkDtI6sw4PzrIbrOuedBb9MALD7zv+3m+z4/3Bf7bZS2bzQIAcrmcMDExcTeXy10DAFVVAQDksgFUVZ1ljD3yfd+0LOuFpmnvVVW9GHhkZAQcxwkNDQ2FSCQyRMgJxnVdy7KstKZpn7nwha6urqqfTqfPBAJAuVymlNLXoigOhfd5nmeiKL5TVTV+lmIKwAOA7u5u6Lped2BsbOwjY6yf4zgQQkAIAcedaPR9H67r3uYBQFEUFItFtLe332lpaVkUBOHK3t5eRtf1DwAwODiIubk5DA8PM8bYW1EU+wEgCIJqsCAIQAiB7/u253k2BQDDMJBKpa4mEon5eDx+UxAESJL0uK2t7XosFlvSdf0QAEmlUnlRFJ9Waho2Qghc1/U9z3uWz+eX+Wr+lL6SZfleEAQIggA8z6OpqSknimIvYyybSCReMsZ6TislhCAIAti2Dc/zejVNWwCAavN8339j27YbTg0AGGM3WltbP4WhlRWq6Q/btrs1TVsYHx+vNgqKoqBUKn2NRqPFxsbGJzzP05puUlpt0ukyOI6z7zjOwNTU1OLo6CgmJyf/gA3DgKIoWF1d/cIY24/FYgOU0pp0z/Ityzo8Pj5OTk9PbwHA+vp6zWghDC+VSiuRSOQgGo32UErJ38CO42wdHR09LBQK3zKZDDY2NupmFmF4R0cHVlZWlmRZ/iVJUn9FeWWcCCE4ODjYtG27Z2Zm5juAOmgdGAB2d3cBADs7O8uSJN2SZfl+WKlpmpumaT6Yn58vn/fs6XmbhmHMNjc3tzDGFI7jYJrm5vb29sDa2trPC/9aiqJUy5pOp4f6+vqeJ5PJBAB0dnZe/t8NBajx/z37Df5OGX8d13xzAAAAAElFTkSuQmCC)
          }
        }
      </style>
      <style type="text/css">
        .ff0 {
          font-family: sans-serif;
          visibility: hidden;
        }
  
        
  
        .ff1 {
          font-family: ff1;
          line-height: 1.334000;
          font-style: normal;
          font-weight: normal;
          visibility: visible;
        }
  
       
  
        .ff2 {
          font-family: ff2;
          line-height: 1.385000;
          font-style: normal;
          font-weight: normal;
          visibility: visible;
        }
  
       
        .ff3 {
          font-family: ff3;
          line-height: 1.221000;
          font-style: normal;
          font-weight: normal;
          visibility: visible;
        }
  
        .m0 {
          transform: matrix(0.250000, 0.000000, 0.000000, 0.250000, 0, 0);
          -ms-transform: matrix(0.250000, 0.000000, 0.000000, 0.250000, 0, 0);
          -webkit-transform: matrix(0.250000, 0.000000, 0.000000, 0.250000, 0, 0);
        }
  
        .v0 {
          vertical-align: 0.000000px;
        }
  
        .ls0 {
          letter-spacing: 0.000000px;
        }
  
        .sc_ {
          text-shadow: none;
        }
  
        .sc0 {
          text-shadow: -0.015em 0 transparent, 0 0.015em transparent, 0.015em 0 transparent, 0 -0.015em transparent;
        }
  
        @media screen and (-webkit-min-device-pixel-ratio:0) {
          .sc_ {
            -webkit-text-stroke: 0px transparent;
          }
  
          .sc0 {
            -webkit-text-stroke: 0.015em transparent;
            text-shadow: none;
          }
        }
  
        .ws0 {
          word-spacing: 0.000000px;
        }
  
        ._0 {
          width: 1256.586480px;
        }
  
        .fc0 {
          color: rgb(0, 0, 0);
        }
  
        .fs1 {
          font-size: 26.400000px;
        }
  
        .fs6 {
          font-size: 29.720000px;
        }
  
        .fs4 {
          font-size: 33.000000px;
        }
  
        .fs2 {
          font-size: 39.600000px;
        }
  
        .fs5 {
          font-size: 41.240000px;
        }
  
        .fs0 {
          font-size: 48.000000px;
        }
  
        .fs3 {
          font-size: 49.520000px;
        }
  
        .y0 {
          bottom: -0.500000px;
        }
  
        .y1 {
          bottom: 17.590000px;
        }
  
        .y2 {
          bottom: 28.390000px;
        }
  
        .y21 {
          bottom: 112.680000px;
        }
  
        .y20 {
          bottom: 130.950000px;
        }
  
        .y1f {
          bottom: 171.180000px;
        }
  
        .y1e {
          bottom: 189.450000px;
        }
  
        .y1d {
          bottom: 229.680000px;
        }
  
        .y1c {
          bottom: 247.950000px;
        }
  
        .y1b {
          bottom: 288.180000px;
        }
  
        .y1a {
          bottom: 306.450000px;
        }
  
        .y19 {
          bottom: 346.680000px;
        }
  
        .y18 {
          bottom: 364.950000px;
        }
  
        .y17 {
          bottom: 405.180000px;
        }
  
        .y16 {
          bottom: 423.450000px;
        }
  
        .y14 {
          bottom: 462.490000px;
        }
  
        .y15 {
          bottom: 462.630000px;
        }
  
        .y13 {
          bottom: 478.530000px;
        }
  
        .y11 {
          bottom: 494.060000px;
        }
  
        .y12 {
          bottom: 494.250000px;
        }
  
        .y10 {
          bottom: 534.860000px;
        }
  
        .yf {
          bottom: 556.160000px;
        }
  
        .yd {
          bottom: 597.150000px;
        }
  
        .ye {
          bottom: 597.330000px;
        }
  
        .yb {
          bottom: 619.200000px;
        }
  
        .yc {
          bottom: 619.350000px;
        }
  
        .ya {
          bottom: 637.950000px;
        }
  
        .y9 {
          bottom: 659.250000px;
        }
  
        .y8 {
          bottom: 689.210000px;
        }
  
        .y7 {
          bottom: 707.620000px;
        }
  
        .y6 {
          bottom: 732.640000px;
        }
  
        .y5 {
          bottom: 743.700000px;
        }
  
        .y4 {
          bottom: 754.760000px;
        }
  
        .y3 {
          bottom: 773.210000px;
        }
  
        .h4 {
          height: 27.799200px;
        }
  
        .hb {
          height: 28.263720px;
        }
  
        .h9 {
          height: 34.452000px;
        }
  
        .h7 {
          height: 34.749000px;
        }
  
        .ha {
          height: 41.342400px;
        }
  
        .h5 {
          height: 41.698800px;
        }
  
        .h8 {
          height: 43.054560px;
        }
  
        .h2 {
          height: 50.544000px;
        }
  
        .h6 {
          height: 51.698880px;
        }
  
        .h3 {
          height: 785.140000px;
        }
  
        .h0 {
          height: 841.880000px;
        }
  
        .h1 {
          height: 842.500000px;
        }
  
        .w2 {
          width: 538.570000px;
        }
  
        .w0 {
          width: 595.280000px;
        }
  
        .w1 {
          width: 596.000000px;
        }
  
        .x0 {
          left: 0.000000px;
        }
  
        .x3 {
          left: 6.000000px;
        }
  
        .x8 {
          left: 10.880000px;
        }
  
        .x5 {
          left: 15.380000px;
        }
  
        .x4 {
          left: 22.500000px;
        }
  
        .x2 {
          left: 28.350000px;
        }
  
        .xa {
          left: 36.830000px;
        }
  
        .x6 {
          left: 274.310000px;
        }
  
        .x7 {
          left: 355.200000px;
        }
  
        .xb {
          left: 376.500000px;
        }
  
        .x9 {
          left: 484.800000px;
        }
  
        .x1 {
          left: 560.920000px;
        }
  
        @media print {
          .v0 {
            vertical-align: 0.000000pt;
          }
  
          .ls0 {
            letter-spacing: 0.000000pt;
          }
  
          .ws0 {
            word-spacing: 0.000000pt;
          }
  
          ._0 {
            width: 1675.448640pt;
          }
  
          .fs1 {
            font-size: 35.200000pt;
          }
  
          .fs6 {
            font-size: 39.626667pt;
          }
  
          .fs4 {
            font-size: 44.000000pt;
          }
  
          .fs2 {
            font-size: 52.800000pt;
          }
  
          .fs5 {
            font-size: 54.986667pt;
          }
  
          .fs0 {
            font-size: 64.000000pt;
          }
  
          .fs3 {
            font-size: 66.026667pt;
          }
  
          .y0 {
            bottom: -0.666667pt;
          }
  
          .y1 {
            bottom: 23.453333pt;
          }
  
          .y2 {
            bottom: 37.853333pt;
          }
  
          .y21 {
            bottom: 150.240000pt;
          }
  
          .y20 {
            bottom: 174.600000pt;
          }
  
          .y1f {
            bottom: 228.240000pt;
          }
  
          .y1e {
            bottom: 252.600000pt;
          }
  
          .y1d {
            bottom: 306.240000pt;
          }
  
          .y1c {
            bottom: 330.600000pt;
          }
  
          .y1b {
            bottom: 384.240000pt;
          }
  
          .y1a {
            bottom: 408.600000pt;
          }
  
          .y19 {
            bottom: 462.240000pt;
          }
  
          .y18 {
            bottom: 486.600000pt;
          }
  
          .y17 {
            bottom: 540.240000pt;
          }
  
          .y16 {
            bottom: 564.600000pt;
          }
  
          .y14 {
            bottom: 616.653333pt;
          }
  
          .y15 {
            bottom: 616.840000pt;
          }
  
          .y13 {
            bottom: 638.040000pt;
          }
  
          .y11 {
            bottom: 658.746667pt;
          }
  
          .y12 {
            bottom: 659.000000pt;
          }
  
          .y10 {
            bottom: 713.146667pt;
          }
  
          .yf {
            bottom: 741.546667pt;
          }
  
          .yd {
            bottom: 796.200000pt;
          }
  
          .ye {
            bottom: 796.440000pt;
          }
  
          .yb {
            bottom: 825.600000pt;
          }
  
          .yc {
            bottom: 825.800000pt;
          }
  
          .ya {
            bottom: 850.600000pt;
          }
  
          .y9 {
            bottom: 879.000000pt;
          }
  
          .y8 {
            bottom: 918.946667pt;
          }
  
          .y7 {
            bottom: 943.493333pt;
          }
  
          .y6 {
            bottom: 976.853333pt;
          }
  
          .y5 {
            bottom: 991.600000pt;
          }
  
          .y4 {
            bottom: 1006.346667pt;
          }
  
          .y3 {
            bottom: 1030.946667pt;
          }
  
          .h4 {
            height: 37.065600pt;
          }
  
          .hb {
            height: 37.684960pt;
          }
  
          .h9 {
            height: 45.936000pt;
          }
  
          .h7 {
            height: 46.332000pt;
          }
  
          .ha {
            height: 55.123200pt;
          }
  
          .h5 {
            height: 55.598400pt;
          }
  
          .h8 {
            height: 57.406080pt;
          }
  
          .h2 {
            height: 67.392000pt;
          }
  
          .h6 {
            height: 68.931840pt;
          }
  
          .h3 {
            height: 1046.853333pt;
          }
  
          .h0 {
            height: 1122.506667pt;
          }
  
          .h1 {
            height: 1123.333333pt;
          }
  
          .w2 {
            width: 718.093333pt;
          }
  
          .w0 {
            width: 793.706667pt;
          }
  
          .w1 {
            width: 794.666667pt;
          }
  
          .x0 {
            left: 0.000000pt;
          }
  
          .x3 {
            left: 8.000000pt;
          }
  
          .x8 {
            left: 14.506667pt;
          }
  
          .x5 {
            left: 20.506667pt;
          }
  
          .x4 {
            left: 30.000000pt;
          }
  
          .x2 {
            left: 37.800000pt;
          }
  
          .xa {
            left: 49.106667pt;
          }
  
          .x6 {
            left: 365.746667pt;
          }
  
          .x7 {
            left: 473.600000pt;
          }
  
          .xb {
            left: 502.000000pt;
          }
  
          .x9 {
            left: 646.400000pt;
          }
  
          .x1 {
            left: 747.893333pt;
          }
        }
      </style>
     
      <style>
        @media screen {
          .pc {
            display: none;
          }
        }
      </style>
      <title></title>
    </head>
    <body>
      <div id="sidebar">
        <div id="outline"></div>
      </div>
      <div id="page-container">
        <div id="pf1" class="pf w0 h0" data-page-no="1">
          <div class="pc pc1 w0 h0 opened">
            <div class="c x2 y2 w2 h3">
              <div class="t m0 x3 h4 y3 ff1 fs1 fc0 sc0 ls0 ws0">Généré par User (${moment().format('YYYY/MM/DD HH:mm')}). Tous les prix en MAD sauf mention contraire</div>
              <div class="t m0 x3 h5 y4 ff1 fs2 fc0 sc0 ls0 ws0">${PointOfSale.title}</div>
              <div class="t m0 x3 h5 y5 ff1 fs2 fc0 sc0 ls0 ws0">${PointOfSale.address}</div>
              <div class="t m0 x3 h6 y7 ff2 fs3 fc0 sc0 ls0 ws0">Rapport opérationnel pour ${(moment().locale('fr')).format('dddd')}</div>
              <div class="t m0 x3 h7 y8 ff1 fs4 fc0 sc0 ls0 ws0">Plage horaire du rapport: Journée entière </div>
              <div class="t m0 x4 h8 y9 ff2 fs5 fc0 sc0 ls0 ws0">A. CA Brut (Ventes)</div>
              <div class="t m0 x4 h9 ya ff2 fs4 fc0 sc0 ls0 ws0">Départements</div>
              <div class="t m0 x5 h9 yb ff2 fs4 fc0 sc0 ls0 ws0">Ventes TTC</div>
              <div class="t m0 x6 h7 yc ff1 fs4 fc0 sc0 ls0 ws0">Aucun article</div>
              <div class="t m0 x7 h9 yb ff2 fs4 fc0 sc0 ls0 ws0">0.00</div>
              <div class="t m0 x8 ha yd ff2 fs2 fc0 sc0 ls0 ws0">CA Brut (Ventes)</div>
              <div class="t m0 x9 h5 ye ff1 fs2 fc0 sc0 ls0 ws0">MAD 0.00</div>
              <div class="t m0 x9 h5 ye ff1 fs2 fc0 sc0 ls0 ws0">MAD 0.d</div>
              <div class="t m0 x4 h8 yf ff2 fs5 fc0 sc0 ls0 ws0">B. CA Net (Recettes)</div>
              <div class="t m0 x4 h9 y10 ff2 fs4 fc0 sc0 ls0 ws0">Montants reçus</div>
              <div class="t m0 x8 ha y11 ff2 fs2 fc0 sc0 ls0 ws0">CA Net (Recettes)</div>
              <div class="t m0 x9 h5 y12 ff1 fs2 fc0 sc0 ls0 ws0">MAD 0.00</div>
              <div class="t m0 xa hb y13 ff3 fs6 fc0 sc0 ls0 ws0">Moins les taxes <span class="_ _0"></span>-0.00 </div>
              <div class="t m0 x8 h9 y14 ff2 fs4 fc0 sc0 ls0 ws0">CA net, sans les taxes</div>
              <div class="t m0 xb h7 y15 ff1 fs4 fc0 sc0 ls0 ws0">MAD 0.00</div>
              <div class="t m0 x4 h8 y16 ff2 fs5 fc0 sc0 ls0 ws0">C. Rapport des taxes</div>
              <div class="t m0 x4 h7 y17 ff1 fs4 fc0 sc0 ls0 ws0">Le rapport des taxes est vide.</div>
              <div class="t m0 x4 h8 y18 ff2 fs5 fc0 sc0 ls0 ws0">D. Articles entrés en mode école</div>
              <div class="t m0 x4 h7 y19 ff1 fs4 fc0 sc0 ls0 ws0">Aucune transaction école dans ce rapport.</div>
              <div class="t m0 x4 h8 y1a ff2 fs5 fc0 sc0 ls0 ws0">E. Articles offerts à prix zéro</div>
              <div class="t m0 x4 h7 y1b ff1 fs4 fc0 sc0 ls0 ws0">Aucun article offert dans ce rapport.</div>
              <div class="t m0 x4 h8 y1c ff2 fs5 fc0 sc0 ls0 ws0">F. Articles en perte</div>
              <div class="t m0 x4 h7 y1d ff1 fs4 fc0 sc0 ls0 ws0">Aucune perte dans ce rapport.</div>
              <div class="t m0 x4 h8 y1e ff2 fs5 fc0 sc0 ls0 ws0">G. Articles présents dans des tickets annulés</div>
              <div class="t m0 x4 h7 y1f ff1 fs4 fc0 sc0 ls0 ws0">Aucun article annulé dans ce rapport.</div>
              <div class="t m0 x4 h8 y20 ff2 fs5 fc0 sc0 ls0 ws0">H. Corrections backoffice comprises dans le rapport, effectuées après la clôture</div>
              <div class="t m0 x4 h7 y21 ff1 fs4 fc0 sc0 ls0 ws0">Aucune correction dans ce rapport.</div>
            </div>
          </div>
          <div class="pi" data-data="{&quot;ctm&quot;:[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}"></div>
        </div>
      </div>
     
    </body>
  </html>`
}
const getTicketPdf = ({ pointOfSale, Orders, user }) => {
  return (

    `<style>
    
    #register {
      width: 20em;
      margin: auto;
    }
    #ticket {
      background: white;
      margin: 0 1em;
      padding: 1em;
      box-shadow: 0 0 5px rgba(0,0,0,.25);
    }
    #ticket h1 {
      text-align: center;
    } 
    #entry {
      background: #333;
      padding: 12px;
      border-radius: 10px;
      box-shadow: 0 0 5px rgba(0,0,0,.25);
    }
    </style>
    <div id="register">
    <div id="ticket">
      <h1>Ticket</h1>
      <p style="text-align:center;font-size:14px">${pointOfSale.title}</p>
      <p style="text-align:center;font-size:5px">${pointOfSale.address}</p>
      <hr />
      <div style="display:flex;flex-direction:row;justify-content:space-between;height:15px">
        <p style="font-size:9px">Impression:</p>
        <p style="font-size:9px">${moment().format('YYYY/MM/DD HH:mm:ss')}</p>
      </div>
        <div style="display:flex;flex-direction:row;justify-content:space-between;height:15px">
          <p style="font-size:9px">Overture:</p>
          <p style="font-size:9px">${moment().format('YYYY/MM/DD HH:mm:ss')}</p>
        </div>
        <div style="display:flex;flex-direction:row;justify-content:space-between;height:15px">
          <p style="font-size:9px">Fermeture:</p>
          <p style="font-size:9px">${moment().format('YYYY/MM/DD HH:mm:ss')}</p>
       </div>
       <div style="display:flex;flex-direction:row;justify-content:space-between;height:15px">
        <p style="font-size:9px">CAISSE:</p>
        <p style="font-size:9px">${user.firstName} ${user.lastName}</p>
      </div>
      
      <hr />
      <p style="font-size:9px">1 - General</p>
        <div style="display:flex;flex-direction:row;justify-content:space-between;height:25px">
          <p style="font-size:9px">Nomber de tickets:</p>
          <p style="font-size:9px">${Orders.length}</p>
        </div>
        <div style="display:flex;flex-direction:row;justify-content:space-between;height:25px">
          <p style="font-size:9px">Total des tickets:</p>
          <p style="font-size:9px">${0}</p>
        </div>
        <div style="display:flex;flex-direction:row;justify-content:space-between;height:25px">
          <p style="font-size:9px">T   otal encaissé:</p>
          <p style="font-size:9px">${48584.4}</p>
       </div>
       <div style="display:flex;flex-direction:row;justify-content:space-between;height:25px">
        <p style="font-size:9px">Panier moyen:</p>
        <p style="font-size:9px">${250.0}</p>
      </div>

      <hr />
      <p style="font-size:9px">2 - ENCAISSEMENTS</p>
        <div style="display:flex;flex-direction:row;justify-content:space-between;height:25px">
          <p style="font-size:9px">CB</p>
          <p style="font-size:9px">Carte:</p>
          <p style="font-size:9px">[3]</p>
          <p style="font-size:9px">${0}</p>
        </div>
        <div style="display:flex;flex-direction:row;justify-content:space-between;height:25px">
          <p style="font-size:9px">ESP</p>
          <p style="font-size:9px">Espace</p>
          <p style="font-size:9px"></p>
          <p style="font-size:9px">${0}</p>
        </div>
        <div style="display:flex;flex-direction:row;justify-content:space-between;height:25px">
          <p style="font-size:9px">AVR</p>
          <p style="font-size:9px">Avoir</p>
          <p style="font-size:9px">[3]</p>
          <p style="font-size:9px">${0}</p>
       </div>

       <hr />
      <p style="font-size:9px">3 - CHIFFRE D'AFFAIRE</p>
        <div style="display:flex;flex-direction:row;justify-content:space-between;height:25px">
          <p style="font-size:9px">Total HT</p> 
          <p style="font-size:9px">${0}</p>
        </div>
      
    </div>
  </div>`
  )
}
export {
  getPdf,
  getTicketPdf
}   
