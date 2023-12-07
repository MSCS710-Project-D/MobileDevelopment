import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function SavedAddresses({ addresses }) {
    return (
        <div>
            {addresses.map((address, index) => (
                <Accordion key={index}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                    >
                        <Typography>{address.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {address.firstName} {address.lastName}, {address.address1}, {address.city}, {address.state}
                            {/* ... Display other address details ... */}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}

export default SavedAddresses;
