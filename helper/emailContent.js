const { convertToPositive } = require("./helper");

exports.emailContentsHtml = (topic, NewMinutess, genstatus, gridStatus) => {
  `<div style=" width: 100%; background: gray">
      <div style="padding: 30px">
   
       
        <br />
        <p
          style="
            font-weight: 100;
            font-size: 16px;
            line-height: 37px;
            font-family: Verdana;
            color: #f4f4fc;
            font-family: Verdana;
          "
        >
      The mqtt topic <b>${topic}</b> the generator and grid status have been on for about last <b>${NewMinutess}</b>    <br>
        </p>
        <br />
        <div
          style="
          
         
            color: white;
            padding: 1px 0 10px 0;
          "
        >
          <p
            style="
              
              font-weight: 100;
              font-size: 20px;
              line-height: 57px;
              font-family: Verdana;
              margin: 10px;
            "
          >
          Generator Status:     <span
              style="
                text-align: center;
                font-weight: 100;
                font-size: 30px;
                line-height: 57px;
                font-family: Verdana;
                margin: 0px;
              "
              >${genstatus === "1" ? "ON" : genstatus}</span
          </p>
        
          <p
            style="
            
              font-weight: 100;
              font-size: 20px;
              line-height: 57px;
              font-family: Verdana;
              margin: 10px;
            "
          >
          Grid Status:   <span
              style="
                text-align: center;
                font-weight: 100;
                font-size: 30px;
                line-height: 57px;
                font-family: Verdana;
                margin: 0px;
              "
              >${gridStatus === "1" ? "ON" : gridStatus}</span
          </p>
        
           <p
            style="
             
              font-weight: 100;
              font-size: 20px;
              line-height: 57px;
              font-family: Verdana;
              margin: 10px;
            "
          >
         Time both have been on :   <span
              style="
                text-align: center;
                font-weight: 100;
                font-size: 30px;
                line-height: 57px;
                font-family: Verdana;
                margin: 0px;
              "
              >${NewMinutess + "mins"}</span
          </p>
        
        </div>
        <br />
        <br />
      </div>
      <!-- {{>footer}} -->
    </div>`;
};
exports.FeulTheftEmailNotification = async (siteName, fuelConsumption) => {
  await sendMailOauth(
    // process.env.EMAIL,
    [
      "iobotechltd@gmail.com",
      "essability@gmail.com",
      // "essienv2022@gmail.com",
      // "feyijimirachel@gmail.com",
      // "osun4love@gmail.com",
    ],
    ` There is fuel theft FOR ${siteName}`,

    `<div style=" width: 100%; background: black">
        <div style="padding: 30px">
      <p style="font-family: Verdana">Hi,</p>
          <br />
          <p
            style="
              font-weight: 100;
              font-size: 16px;
              line-height: 37px;
              font-family: Verdana;
              color: #f4f4fc;
              font-family: Verdana;
            "
          >
    The generator status was off and there is fuel consumption of about  <b>${fuelConsumption}</b>ltr    <br>
          </p>
          <br />
          <div
            style="

              color: white;
              padding: 1px 0 10px 0;
            "
          >
          
 
              
             <p
              style="

                font-weight: 100;
                font-size: 20px;
                line-height: 57px;
                font-family: Verdana;
                margin: 10px;
              "
            >
      
      Try to look into it by contacting those in charge of the fuel
        Thank you.
            </p>

          </div>
          <br />
          <br />
        </div>
        <!-- {{>footer}} -->
      </div>`
  );
};
