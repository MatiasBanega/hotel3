odoo.define('sts_pos_booking_system.TableWidget', function(require) {
    'use strict';

    const TableWidget = require('pos_restaurant.TableWidget');
    const Registries = require('point_of_sale.Registries');

    const posTableWidget = TableWidget =>
        class extends TableWidget {
         mounted() {
            super.mounted();
            // call _showRoomTimer once then set interval of 1sec.
            this._showRoomTimer();
            this.showRoomTimer = setInterval(this._showRoomTimer.bind(this), 1000);
        }
        willUnmount() {
            super.willUnmount();
            clearInterval(this.showRoomTimer);
        }
        async _showRoomTimer() {
            const table = this.props.table;
            this.env.pos.db.pos_all_bookings.forEach((booking) => {
                    if (booking['table_id'] && booking['table_id'][0] == this.props.table['id']){
                        try {
                                this.rpc({
                                    model: 'booking.order',
                                    method: 'is_show_timer',
                                    args: [booking.id],
                            }).then((result) => {
                            console.log(result)
                            if (result == true){
                                table.is_show_timer = true
                                var booking_start_hour = booking.time_slot_id[1].split('-')[0].slice(0, 2);
                                var booking_start_min = booking.time_slot_id[1].split('-')[0].slice(3);
                                var booking_end_hour = booking.time_slot_id[1].split('-')[1].slice(0, 2);
                                var booking_end_min = booking.time_slot_id[1].split('-')[1].slice(3);
                                var end_time = new Date(booking.booking_date);
                                end_time.setHours(booking_end_hour);
                                end_time.setMinutes(booking_end_min);
                                end_time.setSeconds(0);

                                var start_time = new Date(booking.booking_date);
                                start_time.setHours(booking_start_hour);
                                start_time.setMinutes(booking_start_min);
                                start_time.setSeconds(0);
                                var remaining_time = this.env.pos.get_remaining_time(end_time);
                                $('.timer').text(remaining_time);
                                console.log(remaining_time);
                            } else {
                                table.is_show_timer = false;
                            }
                            });
                        } catch (error) {
                            throw error;
                        }
                    }
                });
        }

        get BookingOrder() {
            const table = this.props.table;
            return 'STS'
        }

        get IsShowTimer(){
            return this.props.table.is_show_timer
        }

    };

    Registries.Component.extend(TableWidget, posTableWidget);

    return TableWidget;


});