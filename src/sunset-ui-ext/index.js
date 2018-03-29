import SunsetUi from 'sunset-ui';
import Dicom from './components/curd/widgets/Dicom.vue';
import DicomCard from './components/curd/widgets/DicomCard.vue';

SunsetUi.registFormWidget('Dicom', Dicom);
SunsetUi.registComponent('DicomCard', DicomCard);
