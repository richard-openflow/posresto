import { mediaServerBase } from '@utils';
import moment from 'moment';
import { convertToTimezone } from './convertToTimezone';
import { extraData, freeData, occasionData } from './noteData';


 


export default function bookingsPDF(logo, bookings, isIos, dailyReportingOptions, dailyReportingOptionsData, allBooking, type, statsBookings ) {

  //  <h2 style="font-weight: 700;">    Total:  ${bookings?.length}, Attending PAX : ${bookings.filter(b => !["cancel", "no-show"].includes(b.status)).map(e => e.nbrPeople).reduce((a, b) => a + b, 0)}</h2>

   function groupByEquality(arr, field) {
    const groups = {};
    arr.forEach((element) => {
      if (groups[element[field]]) {
        groups[element[field]].push(element);
      } else {
        groups[element[field]] = [element];
      }
    });
    return Object.values(groups);
  }

    const row = (booking) => {
        return `<tr>
        <td>${booking?.information?.firstName || ""} ${booking?.information?.lastName || ""}</td>
        <td>${booking?.nbrPeople}  </td> 
        <td style="width: 300px">
        ${booking?.note || "-" }
        </td>
        <td style="width: 300px">
        ${booking?.restaurantNotes?.additionalInfo || "-"  }
        </td> 
        <td>${convertToTimezone(booking.STime, 'Etc/Gmt').format('HH:mm')}</td>
        <td>${booking.companyPartner ?`${booking?.companyPartner?.name} - ${booking?.companyPartner?.phone}` : "-"}</td>
        <td>${booking?.units?.map(u => u?.unitNumber).join("-")}</td>
        <td>${booking?.type}</td>
        <td> <span style = 'text-decoration : ${(!booking?.isPayed && booking.requirePayment) ?
          'line-through' : 'none'}; color : ${(!booking?.isPayed && booking.requirePayment) ? 
           'red' : 'black'}'> ${booking?.paymentAmount} </span> ${booking.requirePayment ? 
             `<br /> ${ !booking?.isPayed  ? booking?.paymentDeclined ?booking?.payZonePayment?.id : "Abandoned" : "-"}` :
             
             ""} </td> 
         <td>${booking?.status}</td>
        <td>${booking?.source}</td> 
        <td>${booking?.createdByUser?.firstName?.charAt(0)?.toUpperCase() || "" } - ${booking?.createdByUser?.lastName?.charAt(0)?.toUpperCase() || "" }</td> 
        <td>${booking.staff ? `${booking?.staff?.firstName?.charAt(0)?.toUpperCase()} - ${booking?.staff?.lastName?.charAt(0)?.toUpperCase()}` : "-"}</td> 
        <td> ${occasionData.find(e => e.key === booking?.restaurantNotes?.occasion)?.value || "-"  }</td> 
        <td> ${booking?.restaurantNotes?.free?.length > 0 ? booking?.restaurantNotes?.free.map(fr => freeData.find(e => e.key === fr)?.value).join(" ,") : "-"  }</td> 
        <td> ${booking?.restaurantNotes?.extra?.length > 0 ? booking?.restaurantNotes?.extra.map(fr => extraData.find(e => e.key === fr)?.value).join(" ,") : "-"  }</td> 
    </tr>`
    }


  const stats = () => {
    return `
        ${
          dailyReportingOptions?.map(dro => {
            let label = dailyReportingOptionsData.find(d => d.value === dro).label;
            let numBooking = bookings?.filter(b => b.status === dro)?.length
            return `<span>${label} : ${numBooking}</span>`
          })
        }
    `
  }

  const total = () => {
    let bookingsTotal = bookings?.length || 0;
    let personTotal = bookings?.reduce((acc, cur) => acc + cur.nbrPeople, 0)
    let unitsTotal = bookings?.reduce((acc, cur) => acc + cur.units.length, 0)
    return `
      <span>Total résérvation : ${bookingsTotal}, Total PAX : ${personTotal}, Total table : ${unitsTotal}</span>
    `
  }


  const HourRapport = (booking) => {
    return `
        <p style = "font-size : 20px; width : auto">${convertToTimezone(booking[0]?.STime, 'Etc/Gmt').format('HH:mm')}  : ${booking?.reduce((acc, cur) => acc + cur.nbrPeople, 0)}</p> 
    `
  }

  const bookingRapport = (booking) => {
    return `
        <p style = "width : 30%; font-size : 20px">${booking[0]?.nbrPeople}  PAX : ${booking?.length}</p> 
    `
  }

	const bookingStats = (booking) => {
		return `
        <p style = "width : 50%; font-size : 20px">${booking?.name} : ${booking?.nbrBookings} BK - ${booking?.nbrPeople} PAX</p> 
    `;
	};

  return   `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Bookings</title>
            <style>
                * {
                    padding: 0;
                    margin: 0;
                    box-sizing: border-box;
                }
                body {  
                    margin: 10px;
                    width : 210mm;
                }
                table {
                    width: 100%;
                    border: 1px solid black;
                    border-collapse: collapse;
                     border: none;
                }
    
                th,
                td {
                    border: 1px solid black;
                    padding: 8px;
                    border: 1px solid #ccc;
                    text-align: center;
                    font-size: 16px;
                }
                table th {
                    background-color: #eee;
                    font-size: 17px;
                    text-transform: capitalize;
                }
            </style>
        </head>
        <body>
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    width :  ${isIos ? "auto" :"calc(100vw - 50px)" } ;
                    background-color : 'red !important'
                "
            >
                <img
                    src="${mediaServerBase}/${logo.path}"
                    style="height: 100px; width: 100px; object-fit: scale-down"
                />


                <div style = "flex : 1;">
                  <h3 style="text-align : center; font-weight: 700; margin-bottom : 10px;">${type || "ALL"}</h3>
                </div>


    
                <div
                    style="
                        display: flex;
                        flex-direction: column-reverse;
                        gap: 5px;
                        justify-content: flex-start;
                        align-items: flex-start;
                        font-weight: 700;
                    "
                >
                    <span>${moment().format("HH:mm:ss")}</span>
                    <span>${moment().format("DD/MM/YYYY")}</span>
                </div>
            </div>
    
            <table>
                <thead>
                    <tr>
                        <th>Client</th>
                        <th>PAX</th>
                        <th>Remarque client</th>
                        <th>Remarque intern</th>
                        <th>Heure</th>
                        <th>Partner</th>
                        <th>N</th>
                        <th>Type</th>
                        <th>Acompte</th>
                        <th>Status</th> 
                        <th>Origin</th>
                        <th>User</th>
                        <th>Staff</th>
                        <th>Occasion</th>
                        <th>Offert</th>
                        <th>Extra</th>
                        <th style="background-color: white;border: none; "></th> 
                    </tr>
                </thead>
                <tbody>

                ${
                    bookings.map(booking => {
                        return row(booking)
                    }).join("")
                } 
                     
                </tbody>
            </table>
        </body>
    </html>


    <div style = "page-break-after : always;"></div>

    <div style = "width :  ${isIos ? "auto" :"calc(100vw - 50px)" } ; padding : 15px">
    <h2 style = "text-align : center; margin-bottom : 35px; width : 100%">Rapport</h2>

    <div style = "display : flex; justify-content : space-between; align-items : flex-start; gap : 15px">
      <div style = "display : flex; align-items : flex-start; gap : 16px; width : 50%; padding : 10px; border : 1px solid #61677A; border-radius : 10px;flex-wrap : wrap;">
        <div style = "width : ${isIos ? "auto" : "calc(50% - 8px)"}">
          <p style = "font-size : 20px; margin-bottom : 10px">Résérvation : ${allBooking?.length || 0}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">Coming : ${allBooking?.filter(bk => bk.status == "coming")?.length || 0}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">Waiting : ${allBooking?.filter(bk => bk.status == "waiting")?.length || 0}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">Check-in : ${allBooking?.filter(bk => bk.status == "check-in")?.length || 0}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">Check-out : ${allBooking?.filter(bk => bk.status == "check-out")?.length || 0}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">No-show : ${allBooking?.filter(bk => bk.status == "no-show")?.length || 0}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">Cancel : ${allBooking?.filter(bk => bk.status == "cancel")?.length || 0}</p>
        </div>
          
        <div style = "width : ${isIos ? "auto" : "calc(50% - 8px)"}">
          <p style = "font-size : 20px; margin-bottom : 10px">Résérvation PAX : ${allBooking?.reduce((acc, cur) => acc + cur.nbrPeople, 0)}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">Coming PAX : ${allBooking?.filter(bk => bk.status == "coming")?.reduce((acc, cur) => acc + cur.nbrPeople, 0)}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">Waiting PAX : ${allBooking?.filter(bk => bk.status == "waiting")?.reduce((acc, cur) => acc + cur.nbrPeople, 0)}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">Check-in PAX : ${allBooking?.filter(bk => bk.status == "check-in")?.reduce((acc, cur) => acc + cur.nbrPeople, 0)}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">Check-out PAX : ${allBooking?.filter(bk => bk.status == "check-out")?.reduce((acc, cur) => acc + cur.nbrPeople, 0)}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">No-show PAX : ${allBooking?.filter(bk => bk.status == "no-show")?.reduce((acc, cur) => acc + cur.nbrPeople, 0)}</p>
          <p style = "font-size : 20px; margin-bottom : 10px">Cancel PAX : ${allBooking?.filter(bk => bk.status == "cancel")?.reduce((acc, cur) => acc + cur.nbrPeople, 0)}</p>
        </div>
          <p style = "width : 100%; border-top : 1px solid #61677A; font-size : 20px; padding-top : 10px;">Total Réservations Confirmées : ${allBooking?.filter(b => ['waiting', 'coming', 'check-in', 'check-out'].includes(b.status))?.length || 0}</p>
          <p style = "width : 100%; font-size : 20px;">Pax / Réservations Confirmées : ${allBooking?.filter(b =>  ['waiting', 'coming', 'check-in', 'check-out'].includes(b.status))?.reduce((acc, cur) => acc + cur.nbrPeople, 0)}</p>
        </div>
      
      
      <div style = "width : 50%; display : flex; gap : 10px; flex-direction : column; padding : 10px; border : 1px solid #61677A; border-radius : 10px;">
        <p style = "font-size : 22px; text-align : center; width : 100%">Total Booking / Pax</p>
        <div style = "display : flex; gap : 10px; flex-direction : row; flex-wrap : wrap; justify-content : space-between">
        ${groupByEquality(allBooking?.filter(b => !["cancel", "no-show"].includes(b.status)), "nbrPeople").map(booking => {
            return bookingRapport(booking)
          }).join("")}
          </div>
        </div>  
        


      </div>

      <div style = "width : 100%; display : flex; gap : 10px; flex-direction : column; margin-top : 15px; padding : 10px; border : 1px solid #61677A; border-radius : 10px;">
        <p style = "font-size : 22px; text-align : center; width : 100%">Total Pax / Hour</p>
        <div style = "display : flex; gap : 10px; flex-direction : row; flex-wrap : wrap; justify-content : flex-start">
          ${groupByEquality(allBooking?.filter(b => !["cancel", "no-show"].includes(b.status)), "STime").sort((a, b) => a[0].STime - b[0].STime).map(booking => {
            return HourRapport(booking)
          }).join("")}
        </div>
      </div>



      <div style = "width : 100%; display : flex; gap : 10px; flex-direction : column; padding : 10px; border : 1px solid #61677A; border-radius : 10px; ">
        <p style = "font-size : 22px; text-align : center; width : 100%">Total PAX / Service</p>
          <div style = "display : flex; gap : 10px; flex-direction : row; flex-wrap : wrap; justify-content : space-between">
            ${statsBookings.map(booking => {
              return bookingStats(booking)
            }).join("")}
        </div>
    </div>
    </div>

    `
  
}
