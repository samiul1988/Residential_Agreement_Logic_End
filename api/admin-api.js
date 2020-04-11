
var nodemailer = require('nodemailer');
var fs = require('fs');
var moment = require('moment');
const creds = require('../config');
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;


var generateLeaseReport = async (req, res) => {
    // remove previous pdf file (if any)
    try {
        fs.unlinkSync('ResidentialAgreement.pdf');
    } catch(err) {
        // console.log(err);
    }

    // console.log("Request Full Body: ", req.body);
    let leaseType = "";
    if (req.body.leaseType == "Fixed Term") {
        leaseType = `${req.body.leaseType} (${req.body.termDuration} Months) (Section 1E of the Act)`; 
    } else {
        leaseType = req.body.leaseType
    }

    let rentAmount = "";
    if (req.body.leaseType == "Fixed Term") {
        rentAmount = `\$ ${req.body.rentAmount} per term`; 
    } else if (req.body.leaseType == "Month to Month") {
        rentAmount = `\$ ${req.body.rentAmount} per month`; 
    }else {
        rentAmount = `\$ ${req.body.rentAmount} per week`; 
    }

    let leaseStartDay = moment(req.body.startDate).format("Do");
    let leaseStartMonthAndYear = moment(req.body.startDate).format("MMM, YYYY");
    let leaseEndDay = moment(req.body.endDate).format("Do");
    let leaseEndMonthAndYear = moment(req.body.endDate).format("MMM, YYYY");

    let landlordSignatureData = "";
    if (req.body.landlordSignatureData != ""){
        landlordSignatureData = { 
            image: req.body.landlordSignatureData,
            width: 200
        }
    }
    let tenantSignatureData = "";
    if (req.body.tenantSignatureData != ""){
        tenantSignatureData = {
            image: req.body.tenantSignatureData,
            width: 200
        }
    }
    let witnessSignatureData = "";
    if (req.body.witnessSignatureData != ""){
        witnessSignatureData = {
            image: req.body.witnessSignatureData,
            width: 200
        }
    }

    let paymentCycle = req.body.leaseType=="Week to Week"? "each week": "each month";
    let additionalObligations = req.body.additionalObligations == "" ? "None": req.body.additionalObligations; 

    var dd = {
        footer: {
            text: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
        },
        content: [
            {
                text: ' RESIDENTIAL TENANCIES \n RENTAL AGREEMENT\n\n',
                style: 'header'
            },
            {
                text: [
                    {text:`1. Parties. `, bold:true},`The Rental Agreement is made in duplicate between \n`,
                    {text: 'Samiul Hayder Choudhury, Md Morshedul Islam, Md Mahmud Hasan', fontSize:9, bold:true, alignment:'center'}, 
                    {text:', the landlords,\n', fontSize:9},
                    {text:`Address: 4304 Brentwood Green NW, Calgary, Alberta, T2L 1L3\n And \n `, fontSize:9, alignment:'center'},
                    {text: `${req.body.tenantFirstName} ${req.body.tenantLastName} \n\n`,fontSize:9, bold:true, alignment:'center'},
                    
                    `(a Government issued photo identification of the tenant is recommended to be attached with this agreement)\n\n`,
                    {text: `2. Premises. `, bold:true},`The Landlord will rent to the Tenant and the Tenant will rent from the Landlord the following residential premises:\n`,
                    {text: `Room No: ${req.body.roomNumber} of 4304 Brentwood Green NW, Calgary, T2L 1L3, Alberta. \n\n`, bold:true, alignment:'center'},
                    {text:`3. The Act. `, bold:true},`The Act as referenced in this agreement shall mean the Residential Tenancies Act for the Province of Alberta.\n\n`,
                    {text:`4. Term.  `, bold:true},`Selected Lease Option: ${leaseType}\n`,
                    `This Agreement is to begin on the ${leaseStartDay} day of ${leaseStartMonthAndYear} and end on the ${leaseEndDay} day of ${leaseEndMonthAndYear} \n\n`
                ],
                style: 'normal'
            },
            {text:`5. Rent.  \n`, bold:true, style: 'normal'},
            {
                ul:[
                    `The Tenant will pay rent at the following rate: ${rentAmount}.\n`,
                    `The first payment of rent is due on the ${leaseStartDay} day of ${leaseStartMonthAndYear} and thereafter on the 1st day of ${paymentCycle}.\n\n`
                ],
                margin: [20, 0,0,0],
                alignment: 'left',
                style: 'normal'
            },
            {
                text: `Unless otherwise agreed upon, the tenant shall ensure all rental payments are sent or delivered to the landlord or landlords agent. Rent may also be paid by postdated cheques. (Where rent payable, in part or whole, is in other than money, the landlord shall give to the tenant a letter specifying the payment and placing a value on each item contained in the payment). The Landlord in encouraged to provide a receipt to the tenant for any rent received.\n\n`,
                style: 'normal',
                alignment:'justify'
            },
            {
                text:`6. Rental Increment. `,
                style: 'normal',
                bold:true
            },
            {
                text:`Rent may not be increased, according to the section 14 of the Act:`,
                style: 'normal',
            },
            {
                ul:[
                    `during any rental agreement of a fixed term;`,
                    `where the residential premises are rented from week to week or month to month:`,
                    {
                        ul:[
                            {text: `more than once in a 12 month period;`, listType:'circle'},
                            {text: `during the 12 months immediately following the commencement of the rental agreement;`, listType:'circle'}
                        ]
                    },
                    `during the 12 months immediately following the commencement of the rental agreement for the fixed term where a rental agreement for a fixed term expires and the tenancy continues month to month.`
                ],
                style: 'normal',
                margin: [20, 0,0,0],
                alignment: 'left'
            },
            {
                text: `A Landlord must give not less than eight weeks written notice of any rental increase where the residential premises are rented from week to week and not less than three months written notice where the residential premises are rented from month to month.\n\n`,
                style: 'normal',
                alignment: 'justify'
            },
            {
                text:`7. Facilities/Services. `,
                style: 'normal',
                bold:true
            },
            {
                text:`The rent mentioned above includes provision of the following services and facilities:`,
                style: 'normal'
            },
            {
                ul:[
                    'Water Supply',
                    'Hot Water Supply',
                    'Refrigerator',
                    'Furniture',
                    'Range and Oven',
                    'Electricity',
                    'Property Tax',
                    'Washer and Dryer'
                ],
                style: 'normal',
                margin: [20, 0,0,0],
                alignment: 'left'
            },
            {
                text:`The following services are the responsibility of the tenant:`,
                style: 'normal'
            },
            {
                ul:[
                    'Cleaning the premise according to the schedule',
                    'Snow removal from the walkways',
                    'Cutting of grass\n\n'
                ],
                style: 'normal',
                margin: [20, 0,0,0],
                alignment: 'left'
            },
            {
                text:`8. Security Deposit. `,
                style: 'normal',
                bold:true
            },
            {
                text:`The Landlord hereby acknowledges receipt of a security deposit of $ ${req.body.depositAmount} to be held during the period of tenancy.\n\n`,
                style: 'normal',
                alignment:'justify'
            },
            {
                text:`9. Limit of Security Deposit. `,
                style: 'normal',
                bold:true
            },
            {
                text:`Money or other value as a security deposit shall not be in excess of:`,
                style: 'normal',
                alignment:'justify'
            },
            {
                ul:[
                    'The first two weeks rent if premises rented week to week;',
                    'Equal of the first months rent if premises rented month to month;',
                    'Equal of the first months rent that would be payable if rent was proportioned to a monthly payment where the residential premises are rented for a fixed term of not less than six months and not more than 12 months.\n\n'
                ],
                style: 'normal',
                margin: [20, 0,0,0],
                alignment: 'justify'
            },
            {
                text:`10. Notice of Termination. \n\n`,
                style: 'normal',
                bold:true,
                pageBreak: 'before'
            },
            {   
                style: 'normal',
                table: {
                    // heights: 40,
                    body: [
                        ['Type', 'Tenant', 'Landlord'],
                        ['Term Tenancy', 'Not less than one month before the end of the term', 'Not less the one month before the end of the term'],
                        ['Month to Month', 'Not less than one month before the end of the rental period', 'Not less the one month before the end of the rental period'],
                        ['Week to Week', 'Not less than one week before the end of the rental period', 'Not less the one week before the end of the rental period']
                    ]
                }
            },
            {
                text:`\n11. Abandonment before the term or month. `,
                style: 'normal',
                bold:true
            },
            {
                text:` (http://clg.ab.ca/programs-services/dial-a-law/moving-out-of-rented-premises/) \n`,
                style: 'normal',
                italics:true
            },
            {
                ul:[
                    'Must pay full months rent if the tenant fails to notify according to section 10.',
                    'Must pay the full rent until the end of the term if suitable replacement is found according to the landlord.\n\n'
                ],
                style: 'normal',
                margin: [20, 0,0,0],
                alignment: 'justify'
            },
            {
                text:[{text:`12. Statutory Conditions.`, bold:true}, 'The following statutory conditions apply:'],
                style: 'normal'
            },
            {
                type: 'upper-alpha',
                separator: ['(', ')'],
                ol:[
                    {text:'Obligation of the landlord -', counter:1},
                    {
                        ul:[
                            'the landlord shall maintain the premises in a good state of repair and fit for habitation during the tenancy and shall comply with a law respecting health, safety or housing.',
                            'paragraph (a) applies regardless of whether when the landlord and tenant entered into the rental agreement the tenant had knowledge of a state of non-repair, unfitness for habitation or contravention of a law respecting health, safety or housing in the premises.\n'
                        ]
                    },
                    {text: 'Obligation of the tenant -', counter:2},
                    {
                        ul:[
                            'The tenant shall keep the premises clean, and shall repair damage caused by a willful or negligent act of the tenant or of a person whom the tenant permits on the premises.',
                            {text: 'Smoking is not allowed inside the house.\n', bold:true}
                        ]
                    },
                    {text: 'Subletting Premises.', counter:3},
                    {
                        ul:[
                            {
                                text: 'The tenant may assign, sublet or otherwise part with possession of the premises subject to the consent of the landlord.\n',
                                listType: 'none'
                            }
                        ]
                    },
                    {text: 'Mitigation on Abandonment.', counter:4},
                    {
                        ul:[
                            {
                                text: 'Where the tenant abandons the premises, the landlord shall mitigate damages that may be caused by the abandonment to the extent that a party to a contract is required by law to mitigate damages. Section 36 of the Act will be applied to mitigate additional damage beyond security deposit.\n',
                                listType: 'none'
                            }
                        ]
                    },
                    {text: 'Entry of Premises.', counter:5},
                    {
                        ul:[
                            {
                                text: 'Except in the case of an emergency, the landlord shall not enter the premises without the consent of the tenant unless',
                                listType: 'none'
                            },
                            {
                                ul:[
                                    'notice of termination of the rental agreement has been given and the entry is at a reasonable time for the purpose of exhibiting the premises to a prospective tenant or purchaser and a reasonable effort has been made to give the tenant at least four hours notice;',
                                    'the entry is made at a reasonable time and written notice of the time of entry has been given to the tenant at least twenty-four hours in advance of the entry;',
                                    'The landlord can enter the premises, if any immediate repair is necessary and will notify the tenant afterwards;',
                                    'the tenant has abandoned the premises under Section 26-29 of the Act.'
                                ],
                                margin: [15, 0,0,0]
                            }
                        ]
                    },
                    {text: 'Entry Doors.', counter:6},
                    {
                        ul:[
                            {
                                text: 'Except by mutual consent, neither the landlord nor the tenant shall, during the use or occupancy of the premises by the tenant, alter a lock or locking system on a door that gives entry to the premises.\n',
                                listType: 'none'
                            }
                        ]
                    },
                    {text: 'Peaceful Enjoyment.', counter:7},
                    {
                        ul:[
                            'The tenant shall not unreasonably interfere with the rights of the landlord or other tenants in the premises, a common area or the property of which they form a part.',
                            'The landlord shall not unreasonably interfere with the tenants peaceful enjoyment of the premises, a common area or the property of which they form a part.',
                            'The Landlord can take action against any kind of domestic violence according to the section 47 of the Act. \n'
                        ]
                    },
                    {text: 'Disconnection of Services.', counter:8},
                    {
                        ul:[
                            {
                                text: 'A landlord or tenant shall not, without the written/oral consent of the other party to the rental agreement, disconnect or cause to be disconnected, heat, water or electric power services being provided to the premises.\n',
                                listType: 'none'
                            }
                        ]
                    },
                ],
                style: 'normal',
                alignment: 'justify',
                margin: [20, 0,0,0]
            },
            {
                text: [            
                        {text: `\n13. Use. `, bold: true}, 
                        `The tenant shall use the residential premises for residential purposes only and will not carry on, or permit to be carried on in the residential premises, any trade or business without the written consent of the landlord.\n\n`,
                        {text: `14. Reasonable Rules and Regulations. `, bold: true}, {text:`The tenant promises to comply with any rules concerning the tenants use or occupancy of the residential premises or building or use of services and facilities provided by the landlord provided that the rules are in writing, are reasonable in all circumstances and the tenant is given a copy of the rules at the time of entering into the rental agreement and is given a copy of any amendments.\n\n`, alignment:'justify'},
                        {text: `15. Tenant’s Copy of the Agreement. `, bold: true}, `A duplicate copy of this signed agreement shall be delivered to the tenant by the landlord within 21 days after the signing of this agreement. The landlord shall advise the tenant in writing of any change of ownership of the residential premises in accordance with Section 17 of the Act.\n\n`,
                        {text: `16. Rental Arrears. `, bold: true}, `In a month to month or term tenancy where the rent is in arrears for 07 days, the landlord may give to the tenant notice that the rental agreement is terminated and that the tenant is required to vacate the residential premises residential premises not less than 14 days after the notice is served. (Section 29(1) of the Act). In a week to week tenancy where the rent is in arrears for 3 days the landlord may give to the tenant notice to terminate the residential premises not less than 3 days after the notice is served (Section 29(1) of the Act). When all arrears of rent are paid in full by the tenant before the termination date on a notice to terminate given for rental arrears, this notice to terminate is void and of no effect. This does not apply where notice to terminate is given more than twice in a 12 month period.\n\n`,
                        {text: `17. Binding Effect and Interpretation. `, bold: true}, `This rental agreement is for the benefit of the landlord and the tenant and is binding on the tenant, the tenants heirs, executors, administrators, and assigns the landlord and the landlords heirs, executors, administrators assigns, and successors in title. This agreement is to be interpreted and executed with direct reference to the Residential Tenancies Act and in conjunction with any landlords rules and regulations as may be attached hereto. Any term or condition added to this agreement that contravenes any of the provisions of the Residential Tenancies Act is void and has no effect.\n\n`,
                        {text: `18. Additional Obligations. `, bold: true}, `${additionalObligations} \n\n`,
                        {text: `19. Alberta Residential Tenancies Act. `, bold: true}, `The tenant has read and/or aware of the Alberta Residential Tenancies Act: ${req.body.tenantAwareOfResidencyAct} \n\n`,
                        {text: `20. Tenants copy of the agreement. `, bold: true}, `The tenant has received a copy of this agreement: ${req.body.tenantWillHaveCopy}\n\n`,
                        {text: `21. Signatures \n\n`, bold: true},
                ],
                style: 'normal'
            },
            {text:`Signature of the Landlord.  \n`, style: 'normal'},
            {   
                style: 'normal',
                table: {
                    heights: function (row) {
                        if (row == 0){
                            return 10;
                        }else{
                            return 90;
                        }
                    },
                    body: [
                        ['Signature', 'Date of Signature'],
                        [
                        landlordSignatureData, 
                        `\n\n\n\n${moment().format("YYYY-MM-DD")}`
                        ]
                    ]
                }
            },
            {text:`\nSignature of the Tenant.  \n`, style: 'normal'},
            {   
                style: 'normal',
                table: {
                    heights: function (row) {
                        if (row == 0){
                            return 10;
                        }else{
                            return 90;
                        }
                    },
                    body: [
                        ['Signature', 'Date of Signature'],
                        [
                        tenantSignatureData, 
                        `\n\n\n\n${moment().format("YYYY-MM-DD")}`
                        ]
                    ]
                }
            },
            {text:`\nName and Signature of the Witness.  \n`, style: 'normal'},
            {   
                style: 'normal',
                table: {
                    heights: function (row) {
                        if (row == 0){
                            return 10;
                        }else{
                            return 90;
                        }
                    },
                    body: [
                        ['Name', 'Signature', 'Date of Signature'],
                        [
                        `\n\n\n\n${req.body.witnessName}`,
                        witnessSignatureData, 
                        `\n\n\n\n${moment().format("YYYY-MM-DD")}`
                        ]
                    ]
                }
            }
            
        ],
        styles: {
            header: {
                fontSize: 12,
                alignment: 'center',
                bold: true
            },
            normal: {
                fontSize: 9
            },
            normalWithUnderline: {
                fontSize: 9,
                decoration:'underline',
                decorationStyle: 'dashed'
            },
            bigger: {
                fontSize: 15,
                italics: true
            }
        }
        
    }
    var fonts = {
        Roboto: {
          normal: 'fonts/Roboto-Regular.ttf',
          bold: 'fonts/Roboto-Medium.ttf',
          italics: 'fonts/Roboto-Italic.ttf',
          bolditalics: 'fonts/Roboto-MediumItalic.ttf'
        }
      };
      
      var PdfPrinter = require('pdfmake');
      var printer = new PdfPrinter(fonts);
      var pdfDoc = printer.createPdfKitDocument(dd);
      pdfDoc.pipe(fs.createWriteStream('ResidentialAgreement.pdf'));
      pdfDoc.end();
      return true
}

var sendEmail = async (req, res) => {
    var transport = {
        host: 'smtp.gmail.com',
        auth: {
            user: creds.USER,
            pass: creds.PASS
        }
    }
    var transporter = nodemailer.createTransport(transport);
    transporter.verify((error, success) => {
        if (error) {
            console.log(error);
            return error
        } else {
            console.log('Server is ready to handle email messages');
        }
    });

    var name = req.body.tenantFirstName
    var email = req.body.tenantEmail
    var content = `Hi ${name}, \n Please find the Residential Agreement Copy attached with this email. \n Thanks!`
  
    var mail = {
      from: creds.USER,
      to: email,
      cc: ["samiulhaydereee@gmail.com", "zia082000@yahoo.com", "mdmorshedul.islam.ucal@gmail.com", "miazinaser@gmail.com", "hasan.eee82@gmail.com" ], //   
      subject: 'Lease Agreement - 4304 Brentwood Green NW, Calgary',
      text: content,
      attachments:[
          {
              path: 'ResidentialAgreement.pdf'
          }
      ]
    }
    // console.log(mail);
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.json({
          msg: 'fail'
        })
      } else {
        res.json({
          msg: 'success'
        })
      }
    })

}

var generateReportAndSendEmail = async (req, res) => {
    let reportGenrationStatus = await generateLeaseReport(req, res);
    if (reportGenrationStatus) {
        let emailStatus = await sendEmail(req, res);
    }
}

module.exports = {
    generateLeaseReport,
    sendEmail,
    generateReportAndSendEmail
}