import pool from "../db.js"

export const Individual = async (req,res) =>
{
    const {nameoftheclaimant,nameofthespouse,nameofFather,address,state,district,taluka,gramPanchayat,village,scheduledTribe,otherTraditionalForestDweller,name,age,forHabitation,forSelfCultivation,disputedLands,pattas,alternativeLand,landFromWhereDisplacedWithoutCompensation,extentOfLandInForestVillages,anyOtherTraditionalRight,evidenceInSupport,anyOtherInformation} = req.body;
    try
    {
        await pool.query(`INSERT INTO "Individual" 
                ("Name of the Claimant",
                "Name of the Spouse",
                "Name of Father",
                "Address",
                "State",
                "District",
                "Taluka",
                "Gram Panchayat",
                "Village",
                "Scheduled Tribe",
                "Other Traditional Forest Dweller",
                "Name",
                "Age",
                "For Habitation",
                "For Self-Cultivation",
                "DisputedLands",
                "Pattas",
                "Alternative Land",
                "Land from Where Displaced Without Compensation",
                "Extent of Land in Forest Villages",
                "Any Other Traditional Right",
                "Evidence in Support",
                "Any Other Information") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
                [
                    nameoftheclaimant,
                    nameofthespouse,
                    nameofFather,
                    address,
                    state,
                    district,
                    taluka,
                    gramPanchayat,
                    village,
                    scheduledTribe,
                    otherTraditionalForestDweller,
                    name,
                    age,
                    forHabitation,
                    forSelfCultivation,
                    disputedLands,
                    pattas,
                    alternativeLand,
                    landFromWhereDisplacedWithoutCompensation,
                    extentOfLandInForestVillages,
                    anyOtherTraditionalRight,
                    evidenceInSupport,
                    anyOtherInformation
                ]);
        res.json({message:'Data Inserted Successfully'});
    }
    catch(err)
    {
        res.json({message:'Server Error',error:err.message});
    }
}

export const Community = async (req,res) =>
{
 const {FDSTcommunity,OTFDcommunity,state,district,taluka,grampanchayat,village,communityrightssuchasnistar,rightsoverminorforestproduce,uses,grazing,traditionalresourceaccessfornomadicandpastoralist,communitytenuresofhabitatandhabitation,righttoaccessbiodiversity,othertraditionalrights,evidenceinsupport,anyotherinformation} = req.body;
    try
    {
        await pool.query(`INSERT INTO "Community" 
                ("FDST community",
                "OTFD community",
                "State",
                "District",
                "Taluka",
                "Gram Panchayat",
                "Village",
                "Community rights such as nistar",
                "Rights over minor forest produce",
                "Uses",
                "Grazing",
                "Traditional resource access for nomadic and pastoralist",
                "Community tenures of habitat and habitation",
                "Right to access biodiversity",
                "Other traditional rights",
                "Evidence in support",
                "Any other information") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
                [FDSTcommunity,OTFDcommunity,state,district,taluka,grampanchayat,village,communityrightssuchasnistar,rightsoverminorforestproduce,uses,grazing,traditionalresourceaccessfornomadicandpastoralist,communitytenuresofhabitatandhabitation,righttoaccessbiodiversity,othertraditionalrights,evidenceinsupport,anyotherinformation]);
        res.json({message:'Data Inserted Successfully'});
    }
    catch(err)
    {
        res.json({message:'Server Error',error:err.message});
    }   
}

export const CommunityResource = async (req,res) =>
{
    const {village,grampanchayat,taluka,district,nameofmembersofthegramsabha,compartmentno,borderingvillages,listofevidenceinsupport} = req.body;
    try
    {
        await pool.query(`INSERT INTO "CommunityResource" 
                ("Village",
                "Gram Panchayat",
                "Taluka",
                "District",
                "Name of members of the Gram Sabha",
                "Compartment No",
                "Bordering Villages",
                "List of Evidence in Support") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                [village,grampanchayat,taluka,district,nameofmembersofthegramsabha,compartmentno,borderingvillages,listofevidenceinsupport]);
        res.json({message:'Data Inserted Successfully'});
    }
    catch(err)
    {
        res.json({message:'Server Error',error:err.message});
    }   
}