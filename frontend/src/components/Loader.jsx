import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loader() {
 

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </div>
  );
}


















// import CircularProgress from '@mui/material/CircularProgress';
// import Box from '@mui/material/Box';

// export default function Loader() {
//     const centerStyle = {
//         position: 'fixed',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         display: 'flex',
//         zIndex: 9999 // Set a high z-index value


//     };
//   return (
//     <Box sx={{
//         ...centerStyle
//     }}>
//         <CircularProgress />
//     </Box>
//   )
// }