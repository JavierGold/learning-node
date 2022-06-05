exports.getOverview = (req,res)=>{
    res.status(200).render('overview',{
      title: 'All tours'
    });
  }

exports.getgetTour =(req,res)=>{
    res.status(200).render('tour',{
      title: 'The Forest Hiker tour'
    });
  }