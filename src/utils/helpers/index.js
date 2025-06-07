class CustomFilter {
    constructor(query){
        this.query = query;
        this.filter = {}
    }

    buildFilterObject(){
        this.handleRoute1();
        this.handlePassengerList();
        this.handleTravelClass();
        this.handleDepartureTime();
        this.handlePriceRange();
        // this.handleRoute2();             //Temporarily disabled
        return this.filter
    }

    //mandatory options first
    //added route1 to the custom filter
    handleRoute1(){
        if (!this.query.route1) return;
        const { route1 } = this.query

        const [ departureAirportCode , arrivalAirportCode ] = route1.split('-')
        this.filter.route1 = {
        departureAirportCode,
        arrivalAirportCode
      }
    }

    //adding passenger selection to the custom filter
    handlePassengerList(){
        if(!this.query.passengerList) return;
        const { passengerList } = this.query

        const [ Adults , Teenagers ] = passengerList.split('-');
        this.filter.passengerList = {
            Adults,
            Teenagers
        }
    }

    //Handle Travel Class selection
    handleTravelClass(){
        if(!this.query.travelClass) return;
        const { travelClass } = this.query
        this.filter.travelClass = {};

        const [Economy, Business, FirstClass] = travelClass.split('-');
        if (Economy !== '0') this.filter.travelClass.Economy = Economy;
        if (Business !=='0') this.filter.travelClass.Business = Business;
        if (FirstClass !=='0') this.filter.travelClass.FirstClass = FirstClass;
    }

    //
    handleDepartureTime(){
        if(!this.query.departureTime) return;
        const { departureTime } = this.query;

        this.filter.departureTime = departureTime;
    }


    //Writing additional Filter options
    //added price filter to the custom filter if opted
    handlePriceRange(){
        if(!this.query.priceRange) return;                          // returning if no price range provided

        const { priceRange } = this.query

        this.filter.priceRange = {}
        const [ minPrice , maxPrice ] = priceRange.split('-');
        this.filter.priceRange = {
            minPrice,
            maxPrice
        }
    }

    //added route2 filter to the custom filter if opted
    handleRoute2(){
        if(!this.query.route2) return;                          // returning if additional route not provided

        const { route2 } = this.query

        const [ departureAirportCode , arrivalAirportCode ] = route2.split('-')
        this.filter.route2 = {
        departureAirportCode,
        arrivalAirportCode
      }
    }

}

class CustomSort {
    constructor(query){
        this.query = query;
        this.sort = []
    }

    buildSortObject(){
        this.sortQuery()
        
        return [this.sort];
    }

    //Creating the sort object
    sortQuery(){
        if(!this.query.sortBy) return;
        const { sortBy } = this.query;

        this.sort = sortBy.split('_');
    }
}

module.exports = {
    CustomFilter,
    CustomSort
}