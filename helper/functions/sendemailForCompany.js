const sendMailOauth = require("../../oauthEmailSending");

exports.CompanyEmailNotification = async (
  isHavingAdmin,
  SaveadminData,
  email,
  newCompany
) => {
  if (isHavingAdmin === true) {
    await sendMailOauth(
      // process.env.EMAIL,
      [email],
      ` This is your company details FOR ${newCompany.name}`,

      `<div style=" width: 100%; background: black">
        <div style="padding: 30px">
      <p style="font-family: Verdana">Hi, see below your company details</p>
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
    Your apiKey: <span  style=" padding:3px;" > <b>${newCompany.apikey}</b>  </span>   <br>
          </p>  <br />
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
    Your tag name:  <span  style=" padding:3px;" > <b>${newCompany.tag}</b>  </span>     <br>
          </p>
          <br />

       

        
           <p style="font-family: Verdana"> admin login details</p> <br />
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
    Email:  <span  style=" padding:3px;" > <b>${SaveadminData.email}</b>  </span>   <br>
          </p>  <br/>
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
    password:   <span  style=" padding:3px;" > <b>${SaveadminData.password}</b>  </span>       <br>
          </p><br/>
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
     Thanks for choosing us IOBOTECH Team
            </p>

          </div>
          <br />
          <br />
        </div>
        <!-- {{>footer}} -->
      </div>`
    );
  } else {
    await sendMailOauth(
      // process.env.EMAIL,
      [email],
      ` This is your company details FOR ${newCompany.name}`,

      `<div style=" width: 100%; background: black">
          <div style="padding: 30px">
        <p style="font-family: Verdana">Hi, see below your company details</p>
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
    Your apiKey: <span  style=" padding:3px;" > <b>${newCompany.apikey}</b>  </span>   <br>
          </p>  <br />
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
    Your tag name:  <span  style=" padding:3px;" > <b>${newCompany.tag}</b>  </span>     <br>
          </p>
            <br />
          
         <br/>
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
        
       Thanks for choosing us IOBOTECH Team
        
              </p>
  
            </div>
            <br />
            <br />
          </div>
          <!-- {{>footer}} -->
        </div>`
    );
  }
};
