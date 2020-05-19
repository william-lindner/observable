function SingleEvent() {
    this.queue = [];
    this.ready = null;
    this.value = null;
}

SingleEvent.prototype = {
    dep: function (cb) {
        if (this.ready) {
            cb();
        } else {
            this.queue.push(cb);
        }
    },

    run: function () {
        if (this.ready) return;

        this.ready = true;

        this.queue.forEach(function (cb) {
            cb();
        });

        this.queue = [];
    },
};

function Observer(o) {
    this.o = o;
}

Observer.prototype = {
    notify: function (v) {
        this.o.value = v;
        this.o.run();
    },

    value: function () {
        return this.o;
    },
};

function observe(obj) {
    for (let k in obj) {
        const obs = new Observer(obj[k]);

        Object.defineProperty(obj, k, {
            get() {
                return obs.value();
            },
            set(nv) {
                obs.notify(nv);
            },
        });
    }
}

// ---
window.__events = {
    analytics: new SingleEvent(),
};

observe(__events);

__events.analytics.dep(function () {
    console.log("something happened");
});

// app.dispatch("analytics");

(function () {
    let satellite = null;

    Object.defineProperty(window, "_satellite", {
        get: function () {
            return satellite;
        },
        set: function (v) {
            satellite = v;
            __events.analytics = true;
        },
    });
})();

// ---
