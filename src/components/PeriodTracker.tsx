import React,{ useState,useMemo,useEffect} from 'react';
import Modal from 'react-modal';
import { server_calls } from '../api/server';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import Calendar styles
import './styles.css'; // Import the CSS file
import { useAuth } from '../auth/UserAuth';

interface PeriodRecord {
  id: string;
  last_period_date: Date;
  period_duration: number;
}


const PeriodTracker: React.FC<{}> = (): React.ReactNode =>{
  const [openModalOne, setOpenModalOne] = useState(false);
  const [openModalTwo, setOpenModalTwo] = useState(false);
  const [periodDate, setPeriodDate] = useState<Date | null>(null);
  const [periodDuration, setPeriodDuration] = useState<number | null>(null); // Set initial state to null
  const [periodRecords, setPeriodRecords] = useState<PeriodRecord[]>([]); 
  const [selectedRecord, setSelectedRecord] = useState<PeriodRecord | null>(null);
  const [modalOptions, setModalOptions] = useState<string[]>([]);



  const {token} = useAuth();
  const handleSubmit = async () => {
    if (periodDate && token && periodDuration !== null) {
      const data = {
        period_duration: periodDuration,
        last_period_date: periodDate
      };

      await server_calls.createPeriod(data, token);
      setOpenModalOne(false);
      setPeriodDate(null);
      setPeriodDuration(null);
      fetchPeriods(); // Fetch period records after creating a new one
    }
  };



  useEffect(() => {
    fetchPeriods(); // Fetch period records when the component mounts
  }, []);

  const fetchPeriods = async () => {
    try {
      const data = await server_calls.getallPeriod(token);
      const periodRecordsWithDateObjects = data.map((record: PeriodRecord) => ({
        ...record,
        last_period_date: new Date(record.last_period_date)
      }));
      setPeriodRecords(periodRecordsWithDateObjects);
    } catch (error) {
      console.error("Failed to fetch period records:", error);
    }
  };



  const isPeriodDate = useMemo(() => {
    return (date: Date): boolean => {
      return periodRecords.some(record => {
        const startDate = new Date(record.last_period_date);
        const endDate = new Date(startDate.getTime());
        endDate.setDate(endDate.getDate() + record.period_duration);
  
        return date >= startDate && date <= endDate;
      });
    };
  }, [periodRecords]); 
  

  const tileClassName = useMemo(() => {
    return ({ date }: { date: Date }): string => {
      if (isPeriodDate(date)) {
        return 'highlight-dates';
      }
      return '';
    };
  }, [isPeriodDate]);


  const handleDateClick = (value: Date) => {
    setPeriodDate(value);
    const existingRecord = periodRecords.find(record => {
      const startDate = new Date(record.last_period_date);
      const endDate = new Date(startDate.getTime() + record.period_duration * 24 * 60 * 60 * 1000);
      return value >= startDate && value <= endDate;
    });

    if (existingRecord) {
      setSelectedRecord(existingRecord);
      setModalOptions(['Remove Period', 'Period Ends', 'Cancel']);
    } else {
      setModalOptions(['Period Starts', 'Cancel']);
    }

    setOpenModalTwo(true);
  };
  
  

  const handleModalOptionClick = async (option: string) => {
    setOpenModalTwo(false);
    switch (option) {
      case 'Remove Period':
        if (selectedRecord && token) {
          await server_calls.deletePeriod(selectedRecord.id, token);
          fetchPeriods(); // Fetch updated period records after deletion
        }
        break;
      case 'Period Starts':
        setOpenModalOne(true);
        break;
      case 'Period Ends':
        if (selectedRecord && periodDate && token) {
          const startDate = new Date(selectedRecord.last_period_date);
          const endDate = new Date(periodDate);
          const periodDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
          await server_calls.updatePeriod(selectedRecord.id, { ...selectedRecord, period_duration: periodDuration }, token);
          fetchPeriods(); // Fetch updated period records after update
        }
        break;
      default:
        break;
    }
    } ;

  
  
  
  // Helper function to get the ordinal suffix for a number (e.g., 1st, 2nd, 3rd)
  const getOrdinalSuffix = (n: number): string => {
    if (n % 10 === 1 && n % 100 !== 11) {
      return 'st';
    } else if (n % 10 === 2 && n % 100 !== 12) {
      return 'nd';
    } else if (n % 10 === 3 && n % 100 !== 13) {
      return 'rd';
    } else {
      return 'th';
    }
  };

  const getPeriodPhase = () => {
    let details = {
      phase: "No period records found to determine phase.",
      info: "No period records found. Please add a period record to see detailed info."
    };
    
    if (periodRecords.length > 0) {
      const today = new Date();
      const latestRecord = periodRecords.sort((a, b) => new Date(b.last_period_date).getTime() - new Date(a.last_period_date).getTime())[0];
      const startDate = new Date(latestRecord.last_period_date);
      const cycleDayCount = Math.floor((today.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
      const cycleLength = 28; // Assuming a 28-day cycle for simplicity
  
      // Phase determination logic
      if (cycleDayCount >= 1 && cycleDayCount <= 5) {
        details.phase = 'Menstrual Phase';
      } else if (cycleDayCount > 5 && cycleDayCount <= 13) {
        details.phase = 'Follicular Phase';
      } else if (cycleDayCount === 14) {
        details.phase = 'Ovulation Phase';
      } else if (cycleDayCount > 14 && cycleDayCount <= cycleLength) {
        details.phase = 'Luteal Phase';
      } else {
        // This case needs careful handling based on the cycle's specifics
        details.phase = 'Cycle Day Count Beyond Expected Range';
      }

      
      // Detailed phase info logic
      const endDate = new Date(startDate.getTime() + latestRecord.period_duration * 24 * 60 * 60 * 1000);
      endDate.setHours(23, 59, 59, 999);
      if (today >= startDate && today <= endDate) {
        // Within the current period
        const diffInDays = cycleDayCount;
        const daysRemaining = latestRecord.period_duration - diffInDays + 1; // Add 1 to account for the current day
        if (daysRemaining === 0) {
          details.info = "Today is the last day of your period.";
        } else {
          details.info = `Today is the ${diffInDays}${getOrdinalSuffix(diffInDays)} day of your period. ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining.`;
        }
      } else {
        // Outside the current period, estimating next
        const daysSinceEndOfLastPeriod = Math.floor((today.getTime() - endDate.getTime()) / (24 * 60 * 60 * 1000));
        const daysToNextPeriod = cycleLength - daysSinceEndOfLastPeriod;
        const nextPeriodDate = new Date(today.getTime() + daysToNextPeriod * 24 * 60 * 60 * 1000);
        details.info = `Next period is estimated to start in ${daysToNextPeriod} day${daysToNextPeriod === 1 ? '' : 's'}, around ${nextPeriodDate.toLocaleDateString()}.`;
      }
      
    }
  
    return details;
  };

  const { phase, info } = getPeriodPhase();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <h2>Select a Date from the Calendar</h2>
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                setPeriodDate(value);
                handleDateClick(value);
              }
            }}
              value={periodDate}
              onClickDay={handleDateClick}
              tileClassName={tileClassName}
            />
        </div>
      </div>
      <Modal isOpen={openModalOne} onRequestClose={() => setOpenModalOne(false)} contentLabel="Select Period Duration Modal">
        <h2>How many days does your period usually last?</h2>
        <input
          type="number"
          value={periodDuration !== null ? periodDuration : ''} // Conditionally provide default value
          onChange={(e) => setPeriodDuration(parseInt(e.target.value))}
          placeholder="Enter period duration"
        />
        <button onClick={() => {
          setOpenModalOne(false);
          handleSubmit(); // Call handleSubmit when the user submits the period duration
        }}>Submit</button>
      </Modal>
      <Modal isOpen={openModalTwo} onRequestClose={() => setOpenModalTwo(false)} contentLabel="Period Options Modal"  className="custom-modal">
        <div className="modal-options">
          {modalOptions.map(option => (
            <button key={option} onClick={() => handleModalOptionClick(option)}>
              {option}
            </button>
          ))}
        </div>
      </Modal>

      (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <div className="circle-content">
            <div className="phase"><strong>{phase}</strong></div>
            <div className="info">{info}</div>
          </div>
        </div>
      )
  </>
);


};




export default PeriodTracker;
