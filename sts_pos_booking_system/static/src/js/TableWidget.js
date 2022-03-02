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
            this.showRoomTimer = setInterval(this._showRoomTimer.bind(this), 5000);
        }
        willUnmount() {
            super.willUnmount();
            clearInterval(this.showRoomTimer);
        }
        async _showRoomTimer() {
            const table = this.props.table;
            this.env.pos.db.pos_all_bookings.forEach((booking) => {
                    console.log(booking['table_id']);
                    if (booking['table_id'][0] == this.props.table['id']){
                        try {
                                let result = this.rpc({
                                    model: 'booking.order',
                                    method: 'is_show_timer',
                                    args: [booking.id],
                            });
                            console.log(result)
                            if (result == true){
                                table.is_show_timer = true
                                console.log('SHOW');
                            } else {
                                table.is_show_timer = false
                                console.log('hide');
                            }
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
            console.log(this.props.table.id)
            console.log(this.props.table.is_show_timer)
            return this.props.table.is_show_timer
        }

    };

    Registries.Component.extend(TableWidget, posTableWidget);

    return TableWidget;


});