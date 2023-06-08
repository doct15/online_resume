
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };

  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var _ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset(),
      flags = {
        d:    d,
        dd:   pad(d),
        ddd:  dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m:    m + 1,
        mm:   pad(m + 1),
        mmm:  dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy:   String(y).slice(2),
        yyyy: y,
        h:    H % 12 || 12,
        hh:   pad(H % 12 || 12),
        H:    H,
        HH:   pad(H),
        M:    M,
        MM:   pad(M),
        s:    s,
        ss:   pad(s),
        l:    pad(L, 3),
        L:    pad(L > 99 ? Math.round(L / 10) : L),
        t:    H < 12 ? "a"  : "p",
        tt:   H < 12 ? "am" : "pm",
        T:    H < 12 ? "A"  : "P",
        TT:   H < 12 ? "AM" : "PM",
        Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
      };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
}();

// Some common format strings
dateFormat.masks = {
  "default":      "ddd mmm dd yyyy HH:MM:ss",
  shortDate:      "m/d/yy",
  mediumDate:     "mmm d, yyyy",
  longDate:       "mmmm d, yyyy",
  fullDate:       "dddd, mmmm d, yyyy",
  shortTime:      "h:MM TT",
  mediumTime:     "h:MM:ss TT",
  longTime:       "h:MM:ss TT Z",
  isoDate:        "yyyy-mm-dd",
  isoTime:        "HH:MM:ss",
  isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};


function togglelightdarkMode() {
   if (document.body.style.backgroundColor == "white") {
    document.body.style.backgroundColor="black";
    document.body.style.color="white";
    document.getElementById("myName").className = "myname-div-light";
  } else {
    document.body.style.backgroundColor="white";
    document.body.style.color="black";
    document.getElementById("myName").className = "myname-div-dark";
  }
}

function switchSummary() {
  if (document.getElementById("sectionbreakSummarybutton").innerHTML == "Expand") {
    document.getElementById("sectionbreakSummarybutton").innerHTML = "Contract";
    document.getElementById("sectionSummarytext").innerHTML = longSummary;
  } else {
    document.getElementById("sectionbreakSummarybutton").innerHTML = "Expand";
    document.getElementById("sectionSummarytext").innerHTML = shortSummary;
  }
}

function displayExperience() {
  let bigtext = '<table id="myExperiencetable" class="myExperience-table">'
  for (let i = 0; i < 3; i++) {
    let experience = experiences.find(item => item.index === i);
    startdate = dateFormat(experience.startdate, "mm/yyyy");
    enddate = dateFormat(experience.enddate, "mm/yyyy");
    bigtext += '<tr class="experienceHeader"><td id="title' + i + '"; >' + experience.title + '</td><td id="company' + i + '" class="experienceHeadercompany"; >' + experience.company + '</td><td id="startdate' + i + '"; class="experienceHeaderdates">' + startdate + '  -  ' + enddate + '</td></tr>';
    bigtext += '<tr class="experienceText"><td id="experiencetext' + i + '"; colspan=3; >' + experience.shortexperience + '</td></tr>'
    bigtext += '<tr class="experienceText"><td id="experiencetext' + i + '"; colspan=3; >' + experience.longexperience + '</td></tr>'
  }
  bigtext += "</table>";
  document.getElementById("sectionExperiencetext").innerHTML = bigtext;
}









function main() {
  document.addEventListener('DOMContentLoaded', function() {
    switchSummary();
    displayExperience();
  }, false);
}

const shortSummary='<ul><li>A senior technical product manager with strong experience in the DevOps, CI/CD, networking, routing, IPV6, cloud, datacenter, PaaS, SaaS, training, container, kubernetes, documentation, and software testing.</li></ul>';
const longSummary='<ul><li>A senior technical product manager with strong experience in the DevOps, CI/CD, networking, routing, IPV6, cloud, datacenter, PaaS, SaaS, training, container, kubernetes, documentation, and software testing.</li><li>Experienced leading teams on prioritization, estimation, roadmap, and product direction.</li><li>A customer advocate with direct customer experience in developing relations and customer needs analysis.</li><li>Technical editor of O’Reilly’s book “IPv6 Essentials” first edition. <a href="https://www.oreilly.com/library/view/ipv6-essentials/0596001258/">link</a></li><li>Published in AEA Magazine “Why You Should Care About IPv6.” <a href="http://www.tavian.com/mag-article.htm">link</a></li><li>Experienced with startups and acquisitions.</li></ul>'

experiences = [
  {
    "index": 0,
    "title": "TPM2",
    "company": "Axiom Law",
    "startdate": new Date('2021-03-01'),
    "enddate": new Date('2021-12-31'),
    "expand": true,
    "shortexperience": '<ul><li>Managed the development and deployment of features on a SaaS platform for posting and managing the sale, tracking, cation, and payments of legal talent.</li></ul>',
    "longexperience": '<ul><li>Managed the development and deployment of features on a SaaS platform for posting and managing the sale, tracking, cation, and payments of legal talent.</li><li>Cross-function collaboration with various teams, including legal, marketing, sales, design, e-team, development, QA, and more to ensure product met requirements, was ready for delivery, was comprehensive, and met corporate standards.</li><li>Led a team of strong developers in an Agile/Scrum environment, practicing strict adherence to user-story/acceptance-criteria methodologies.</li><li>Conducted scrum daily meetings, grooming sessions, and product new story work demos to ensure the team was on track and in alignment.</li><li>Coordinated with cross-functional teams to ensure that product timelines were met and any issues were promptly resolved.</li><li>Delivered regular product updates to senior management and stakeholders.</li><li>Worked closely with the design team to ensure that the user interface was intuitive and user-friendly.</li><li>Conducted user needs research and analysis to manage the roadmap and prioritize features.</li><li>Tested (QA) new features. Managed change control and release management of new features.</li><li>Successfully launched SaaS features resulting in increased user engagement.</li></ul>',
    "keywords": ["QA", "Product Manager", "SDLC"]
  },
  {
    "index": 1,
    "title": "Sabbatical",
    "company": "Sabbatical/Pandemic Break",
    "startdate": new Date('2019-12-31'),
    "enddate": new Date('2021-02-01'),
    "expand": true,
    "shortexperience": '<ul><li>After completing my period of retention with Puppet I took a sabbatical that went into the pandemic.</li></ul>',
    "longexperience": '<ul><li>After completing my period of retention with Puppet I took a sabbatical that went into the pandemic.</li></ul>',
    "keywords": ["Break", "Wellness"]
  },
  {
    "index": 2,
    "title": "Senior Engineering Technical Product Manager",
    "company": "Puppet",
    "startdate": new Date('2017-09-01'),
    "enddate": new Date('2019-11-30'),
    "expand": true,
    "shortexperience": 'Worked as both product manager and product owner for an enterprise SaaS based B2B and B2C Devops CI/CD automation platform.',
    "longexperience": '<ul><li>Worked with the Puppet executive team on the acquisition of Distelli, bringing my expertise with the Distelli SaaS product to the table.</li><li>Trained the Puppet QA, support, and documentation teams on supporting the Distelli product, enabling a smooth transition for customers and employees. Provided backup support to these teams as a subject matter expert while continuing to fulfill my product management duties.</li><li>Consulted with existing customers and engaged with new opportunities to better understand user needs to improve the product.</li><li>Worked closely with the development/engineering team on user stories, testing, prioritization, roadmap, change control, release management, and more.</li><li>Assisted the sales and marketing teams in understanding the customer personas and how best to approach opportunities with the product.</li><li>Worked with cross-functional teams and business readiness to coordinate releases and new features across all divisions of the organization.</li><li>Developed OKRs (objectives and key results) and KPIs (key performance indicators) for the product, aligning with product procedures at Puppet.</li><li>Presented and negotiated new product and feature ideas to the executive team.</li><li>Conducted in-depth technical competitive analysis reports for multiple DevOps CI/CD automation products.</li><li>Continued working on DevOps, CI/CD, cloud services (AWS, Google Cloud) and solutions, and Kubernetes to stay up to date with the latest developments in the field.</li></ul>',
    "keywords": ["QA", "Product Manager", "SDLC", "SaaS", "PaaS"]
  },
]

main();

