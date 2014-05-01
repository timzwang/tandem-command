(function() {

  function TandemSpot(car) {
    var self = this;
    self.parked = ko.observable(car || null);
    self.requests = ko.observableArray([]);

    self.request = function(car) {
      if (!car || self.parked()) return;
      if (self.requests.indexOf(car) < 0) {
        if (car.spot())
          car.spot().requests.remove(car);
        car.spot(self);
        self.requests.push(car);
      } else {
        car.spot(null);
        self.requests.remove(car);
      }
    }

    self.carHeight = ko.computed(function() {
      return 100/self.requests().length + '%';
    });
  }

  function Car(driver) {
    var self = this;
    self.driver = ko.observable(driver || null);
    self.spot = ko.observable();
    self.parked = ko.observable(false);

    self.park = function() {
      if (!self.spot()) {
        // Toggle street parking
        self.parked(!self.parked());
        return;
      }
      if (!self.parked()) {
        self.parked(true);
        self.spot().requests.remove(self);
        self.spot().parked(self);
      } else {
        self.parked(false);
        self.spot().parked(null);
        self.spot(null);
      }
    }
  }

  function TandemViewModel() {
    var self = this;
    self.cars = ko.observableArray([
    ]);
    self.spots = ko.observableArray([
      new TandemSpot(),
      new TandemSpot()
    ]);
    self.car = ko.observable();

    self.selectCar = function(car) {
      if (car == self.car())
        self.car(null);
      else
        self.car(car);
    }
  };

  ko.applyBindings(new TandemViewModel());
})();
